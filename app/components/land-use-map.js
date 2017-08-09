import Ember from 'ember'; // eslint-disable-line

export default Ember.Component.extend({
  initOptions: {
    style: 'mapbox://styles/mapbox/light-v9',
    zoom: 9,
    center: [-74, 40.7071],
    scrollZoom: false,
  },

  vectorSource: Ember.computed('mapState.landUseTemplate', function () {
    return {
      type: 'vector',
      tiles: ['https://tiles.planninglabs.nyc/pluto/{z}/{x}/{y}/tile.mvt'],
      minzoom: 14,
    };
  }),

  rasterSource: Ember.computed('mapState.landUseTemplate', function () {
    return {
      type: 'raster',
      tiles: ['https://tiles.planninglabs.nyc/pluto/{z}/{x}/{y}/tile.png'],
      tileSize: 256,
      maxzoom: 14,
    };
  }),

  vectorLayer: {
    id: 'landuse-vector',
    type: 'fill',
    source: 'pluto-vector',
    'source-layer': 'pluto',
    minzoom: 14,
    paint: {
      'fill-outline-color': '#cdcdcd',
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
    handleMouseover(e) {
      const feature = e.target.queryRenderedFeatures(e.point, { layers: ['landuse-vector'] })[0];

      if (feature) {
        const { descriptio, address } = feature.properties;
        e.target.getCanvas().style.cursor = 'pointer';
        this.set('mouseoverLocation', {
          x: e.point.x + 30,
          y: e.point.y,
        });
        this.set('tooltip-text', `${address} ${descriptio}`);
      } else {
        e.target.getCanvas().style.cursor = '';
        this.set('mouseoverLocation', null);
      }
    },

    handleMouseleave() {
      this.set('mouseoverLocation', null);
    },
  },

  mapState: Ember.inject.service(),
});
