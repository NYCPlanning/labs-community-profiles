import Ember from 'ember'; // eslint-disable-line

export default Ember.Component.extend({
  initOptions: {
    style: 'mapbox://styles/mapbox/light-v9',
    zoom: 9,
    center: [-74, 40.7071],
  },

  vectorSource: Ember.computed('mapState.landUseTemplate', function () {
    const vectorTemplate = this.get('mapState.landUseTemplate').replace('png', 'mvt');
    return {
      type: 'vector',
      tiles: [vectorTemplate],
      minzoom: 14,
    };
  }),

  rasterSource: Ember.computed('mapState.landUseTemplate', function () {
    return {
      type: 'raster',
      tiles: [this.get('mapState.landUseTemplate')],
      tileSize: 256,
      maxzoom: 14,
    };
  }),

  vectorLayer: {
    id: 'landuse-vector',
    type: 'fill',
    source: 'pluto-vector',
    'source-layer': 'layer0',
    minzoom: 14,
    paint: {
      'fill-color': {
        property: 'landuse',
        type: 'categorical',
        stops: [
          ['01', '#f4f455'],
          ['02', '#f7d496'],
          ['03', '#FF9900'],
          ['04', '#f7cabf'],
          ['05', '#ea6661'],
          ['06', '#d36ff4'],
          ['07', '#dac0e8'],
          ['08', '#5CA2D1'],
          ['09', '#8ece7c'],
          ['10', '#bab8b6'],
          ['11', '#5f5f60'],
        ],
      },
      'fill-opacity': 1,
    },
  },

  rasterLayer: {
    id: 'landuse-raster',
    type: 'raster',
    source: 'pluto-raster',
    maxzoom: 14,
  },

  cdSelectedSource: Ember.computed('mapState', function () {
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

  mapState: Ember.inject.service(),
});
