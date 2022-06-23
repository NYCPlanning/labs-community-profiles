import { inject as service } from '@ember/service'; // eslint-disable-line
import { computed } from '@ember/object';
import Component from '@ember/component';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line
import geoViewport from '@mapbox/geo-viewport'; // eslint-disable-line

import carto from '../utils/carto';

const facdbTable = 'dcp_facilities';

const colorsArray = [
  ['Education, Child Welfare, and Youth', '#f7ca00'],
  ['Parks, Gardens, and Historical Sites', '#4CAF50'],
  ['Libraries and Cultural Programs', '#73E5F4'],
  ['Public Safety, Emergency Services, and Administration of Justice', '#2979FF'],
  ['Health and Human Services', '#BA68C8'],
  ['Core Infrastructure and Transportation', '#8D8EAA'],
  ['Administration of Government', '#CBCBD6'],
];

const SQL = `
  SELECT the_geom_webmercator, facname, facdomain, uid FROM ${facdbTable};
`;

export default Component.extend({
  borocd: '',

  initOptions: computed('mapState', function() {
    const { bounds } = this.get('mapState');
    const { center, zoom } = geoViewport.viewport(bounds, [400, 400]);
    return {
      style: 'https://layers-api.planninglabs.nyc/v1/base/style.json',
      center,
      zoom,
      scrollZoom: false,
    };
  }),

  fitBoundsOptions: {
    linear: true,
    duration: 0,
  },

  vectorSource: computed('facilitiesTemplate', function () {
    return carto.getVectorTileTemplate([SQL])
      .then(facilitiesTemplate => ({
        type: 'vector',
        tiles: [facilitiesTemplate],
      }));
  }),

  pointsLayer: {
    id: 'facilities-points-outline',
    type: 'circle',
    source: 'facilities',
    'source-layer': 'layer0',
    paint: {
      'circle-radius': { stops: [[10, 3], [15, 7]] },
      'circle-color': '#012700',
      'circle-opacity': 0.7,
    },
  },

  pointsOutlineLayer: {
    id: 'facilities-points',
    type: 'circle',
    source: 'facilities',
    'source-layer': 'layer0',
    paint: {
      'circle-radius': { stops: [[10, 2], [15, 6]] },
      'circle-color': {
        property: 'facdomain',
        type: 'categorical',
        stops: colorsArray,
      },
      'circle-opacity': 0.7,
    },
  },

  sql: computed('borocd', function sql() {
    const borocd = this.get('borocd');
    const joinSql = `
      SELECT facdomain, count(facdomain)
      FROM ${facdbTable} a
      INNER JOIN community_districts b
      ON ST_Contains(b.the_geom, a.the_geom)
      WHERE b.borocd = '${borocd}'
      GROUP BY facdomain
    `;

    return joinSql;
  }),

  data: computed('sql', 'borocd', function() {
    const sql = this.get('sql');
    return carto.SQL(sql)
      .then((data) => { // eslint-disable-line
        return data.map((d) => {
          const dWithColor = d;
          [, dWithColor.color] = colorsArray.find(el => el[0] === d.facdomain);
          return dWithColor;
        });
      });
  }),

  cdSelectedSource: computed('mapState.currentlySelected', function () {
    return {
      type: 'geojson',
      data: this.get('mapState.currentlySelected.geometry'),
    };
  }),

  centroid: computed('mapState.currentlySelected', function () {
    return this.get('mapState.centroid');
  }),

  cdSelectedLayer: {
    id: 'cd-line',
    type: 'line',
    source: 'currentlySelected',
    paint: {
      'line-width': 3,
      'line-color': '#000',
      'line-dasharray': [3, 2],
      'line-opacity': 0.6,
    },
  },

  mouseoverLocation: null,
  'tooltip-text': '',

  actions: {
    handleMapLoad(map) {
      map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    },

    handleMouseover(e) {
      const feature = e.target.queryRenderedFeatures(e.point, { layers: ['facilities-points'] })[0];

      if (feature) {
        const { facname } = feature.properties;
        e.target.getCanvas().style.cursor = 'pointer';
        this.set('mouseoverLocation', {
          x: e.point.x + 30,
          y: e.point.y,
        });
        this.set('tooltip-text', `${facname}`);
      } else {
        e.target.getCanvas().style.cursor = '';
        this.set('mouseoverLocation', null);
      }
    },

    handleMouseleave() {
      this.set('mouseoverLocation', null);
    },

    handleClick(e) {
      const feature = e.target.queryRenderedFeatures(e.point, { layers: ['facilities-points'] })[0];
      if (feature) {
        const { uid } = feature.properties;
        window.open(`https://capitalplanning.nyc.gov/facility/${uid}`, '_blank');
      }
    },
  },

  mapState: service(),
});
