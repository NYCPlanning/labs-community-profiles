import { inject as service } from '@ember/service'; // eslint-disable-line
import Component from '@ember/component';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line
import { computed } from 'ember-decorators/object';
import carto from '../utils/carto';
import landUseLookup from '../utils/land-use-lookup';

const SQL = 'SELECT a.the_geom_webmercator, a.landuse, b.description, address FROM mappluto a LEFT JOIN support_landuse_lookup b ON a.landuse::integer = b.code';

export default Component.extend({
  initOptions: {
    style: 'https://layers-api.planninglabs.nyc/v1/base/style.json',
    zoom: 9,
    minZoom: 13.01,
    center: [-74, 40.7071],
    scrollZoom: false,
  },

  fitBoundsOptions: {
    linear: true,
    duration: 0,
  },

  vectorSource: Ember.computed('landuseTemplate', function () { // eslint-disable-line
    return carto.getVectorTileTemplate([SQL])
      .then(landuseTemplate => ({
        type: 'vector',
        tiles: [landuseTemplate],
      }));
  }),

  vectorLayer: {
    id: 'landuse-vector',
    type: 'fill',
    source: 'pluto-landuse',
    'source-layer': 'layer0',
    paint: {
      'fill-color': [
        'match',
        ['get', 'landuse'],
        '01',
        landUseLookup(1).color,
        '02',
        landUseLookup(2).color,
        '03',
        landUseLookup(3).color,
        '04',
        landUseLookup(4).color,
        '05',
        landUseLookup(5).color,
        '06',
        landUseLookup(6).color,
        '07',
        landUseLookup(7).color,
        '08',
        landUseLookup(8).color,
        '09',
        landUseLookup(9).color,
        '10',
        landUseLookup(10).color,
        '11',
        landUseLookup(11).color,
        /* other */ landUseLookup(12).color,
      ],
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
        /* eslint-disable-next-line no-unneeded-ternary */
        const tooltipDescription = description ? description : 'Other';
        e.target.getCanvas().style.cursor = 'pointer';
        this.set('mouseoverLocation', {
          x: e.point.x + 30,
          y: e.point.y,
        });
        this.set('tooltip-text', `${address} ${tooltipDescription}`);
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
