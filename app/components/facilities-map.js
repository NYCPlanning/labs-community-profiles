import Ember from 'ember'; // eslint-disable-line
import mapboxgl from 'mapbox-gl'; // eslint-disable-line

import carto from '../utils/carto';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);

    const SQL = `
      SELECT the_geom_webmercator, facname, facdomain, uid FROM facdb_facilities;
    `;

    carto.getTileTemplate(SQL)
      .then((facilitiesTemplate) => {
        this.set('facilitiesTemplate', facilitiesTemplate);
      });
  },


  initOptions: {
    style: 'mapbox://styles/mapbox/light-v9',
    zoom: 9,
    center: [-74, 40.7071],
    scrollZoom: false,
  },

  vectorSource: Ember.computed('facilitiesTemplate', function () {
    return {
      type: 'vector',
      tiles: [this.get('facilitiesTemplate')],
    };
  }),


  pointsLayer: {
    id: 'facilities-points',
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
    id: 'facilities-points-outline',
    type: 'circle',
    source: 'facilities',
    'source-layer': 'layer0',
    paint: {
      'circle-radius': { stops: [[10, 2], [15, 6]] },
      'circle-color': {
        property: 'facdomain',
        type: 'categorical',
        stops: [
          ['Education, Child Welfare, and Youth', '#f7ca00'],
          ['Parks, Gardens, and Historical Sites', '#4CAF50'],
          ['Libraries and Cultural Programs', '#73E5F4'],
          ['Public Safety, Emergency Services, and Administration of Justice', '#2979FF'],
          ['Health and Human Services', '#BA68C8'],
          ['Core Infrastructure and Transportation', '#8D8EAA'],
          ['Administration of Government', '#CBCBD6'],
        ],
      },
      'circle-opacity': 0.7,
    },
  },

  rasterLayer: {
    id: 'landuse-raster',
    type: 'raster',
    source: 'pluto-raster',
    maxzoom: 14,
  },

  cdSelectedSource: Ember.computed('mapState.feature', function () {
    return {
      type: 'geojson',
      data: this.get('mapState.feature'),
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
      const feature = e.target.queryRenderedFeatures(e.point, { layers: [] })[0];
    },

    handleMouseleave() {
      this.set('mouseoverLocation', null);
    },
  },

  mapState: Ember.inject.service(),
});
