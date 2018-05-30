import { inject as service } from '@ember/service'; // eslint-disable-line
import Component from '@ember/component';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line
import { computed } from 'ember-decorators/object';
import carto from '../utils/carto';

const SQL = 'SELECT a.the_geom_webmercator, a.landuse, b.description, address FROM support_mappluto a LEFT JOIN support_landuse_lookup b ON a.landuse::integer = b.code';

export default Component.extend({
  initOptions: {
    style: '//raw.githubusercontent.com/NYCPlanning/labs-gl-style/master/data/style.json',
    zoom: 9,
    minZoom: 13.01,
    center: [-74, 40.7071],
    scrollZoom: false,
  },

  fitBoundsOptions: {
    linear: true,
    duration: 0,
  },

  vectorSource: Ember.computed('landuseTemplate', function () {
    return carto.getVectorTileTemplate([SQL])
      .then(landuseTemplate => ({
        type: 'vector',
        tiles: [landuseTemplate],
      }));
  }),

  vectorLayer: {
    id: 'landuse-vector',
    type: 'fill',
    source: 'pluto',
    'source-layer': 'layer0',
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

  @computed('mapState.currentlySelected.geometry')
  cdSelectedSource() {
    return {
      type: 'geojson',
      data: this.get('mapState.currentlySelected.geometry'),
    };
  },

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
      const feature = e.target.queryRenderedFeatures(e.point, { layers: ['landuse-vector'] })[0];

      if (feature) {
        const { description, address } = feature.properties;
        e.target.getCanvas().style.cursor = 'pointer';
        this.set('mouseoverLocation', {
          x: e.point.x + 30,
          y: e.point.y,
        });
        this.set('tooltip-text', `${address} ${description}`);
      } else {
        e.target.getCanvas().style.cursor = '';
        this.set('mouseoverLocation', null);
      }
    },

    handleMouseleave() {
      this.set('mouseoverLocation', null);
    },
  },

  mapState: service(),
});
