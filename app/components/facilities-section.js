import Ember from 'ember'; // eslint-disable-line
import mapboxgl from 'mapbox-gl'; // eslint-disable-line

import carto from '../utils/carto';

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
  SELECT the_geom_webmercator, facname, facdomain, uid FROM facdb_facilities;
`;

export default Ember.Component.extend({
  borocd: '',

  initOptions: {
    style: 'mapbox://styles/mapbox/light-v9',
    zoom: 9,
    center: [-74, 40.7071],
    scrollZoom: false,
  },

  vectorSource: Ember.computed('facilitiesTemplate', function () {
    return carto.getTileTemplate(SQL)
      .then((facilitiesTemplate) => {
        return {
          type: 'vector',
          tiles: [facilitiesTemplate],
        };
      });
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

  sql: Ember.computed('borocd', function sql() {
    const borocd = this.get('borocd');
    const SQL = `
      SELECT facdomain, count(facdomain)
      FROM facdb_facilities a
      INNER JOIN support_admin_cdboundaries b
      ON ST_Contains(b.the_geom, a.the_geom)
      WHERE b.borocd = '${borocd}'
      GROUP BY facdomain
    `;

    return SQL;
  }),

  data: Ember.computed('sql', 'borocd', function() {
    const sql = this.get('sql');
    return carto.SQL(sql)
      .then((data) => { // eslint-disable-line
        return data.map((d) => {
          const dWithColor = d;
          dWithColor.color = colorsArray.find(el => el[0] === d.facdomain)[1];
          return dWithColor;
        });
      });
  }),

  cdSelectedSource: Ember.computed('mapState.currentlySelected', function () {
    return {
      type: 'geojson',
      data: this.get('mapState.currentlySelected.geometry'),
    };
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

  mapState: Ember.inject.service(),
});