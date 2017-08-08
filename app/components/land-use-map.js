import Ember from 'ember'; // eslint-disable-line

export default Ember.Component.extend({
  lat: 40.7071266,
  lng: -74,
  zoom: 9.2,
  geomStyle: {
    fill: false,
    color: '#000',
    weight: 2,
    dashArray: '8 5',
    opacity: 0.6,
  },
  rasterSourceOptions: {
    type: 'vector',
    tiles: ['http://localhost:3000/maps/mylayer/{z}/{x}/{y}/tile.pbf'],
  },

  rasterLayerOptions: {
    id: 'landuse',
    type: 'fill',
    source: 'pluto',
    'source-layer': 'layer0',
    minzoom: 0,
    maxzoom: 22,
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

  cdSelectedSource: Ember.computed('mapState', function () {
    return {
      type: 'geojson',
      data: this.get('mapState.geom'),
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
