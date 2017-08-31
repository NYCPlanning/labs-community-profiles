import Ember from 'ember'; // eslint-disable-line
import FacilitiesSection from '../components/facilities-section';
import carto from '../utils/carto';

const pfirm15SQL = 'SELECT the_geom_webmercator, fld_zone FROM support_waterfront_pfirm15 WHERE fld_zone = \'AE\' OR fld_zone = \'VE\'';
const floodplain2050SQL = 'SELECT * FROM cdprofiles_floodplain_2050';

const pfirm15Layer = {
  id: 'pfirm15',
  source: 'floodzones',
  'source-layer': 'layer0',
  type: 'fill',
  paint: {
    'fill-color': {
      property: 'fld_zone',
      type: 'categorical',
      stops: [
        ['VE', '#99CCEE'],
        ['AE', '#99CCEE'],
      ],
    },
    'fill-opacity': 1,
    'fill-antialias': true,
  },
};

const floodplain2050Layer = {
  id: 'floodplain2050',
  source: 'floodzones',
  'source-layer': 'layer1',
  type: 'fill',
  paint: {
    'fill-color': '#D9DDA9',
    'fill-opacity': 1,
    'fill-antialias': true,
  },
};

export default FacilitiesSection.extend({
  pfirm15Template: null,
  vectorSource: Ember.computed('pfirm15Template', function () {
    return carto.getVectorTileTemplate([pfirm15SQL, floodplain2050SQL])
      .then(template => ({
        type: 'vector',
        tiles: [template],
      }));
  }),
  pfirm15Layer,
  floodplain2050Layer,

  rasterSource: {
    type: 'raster',
    tiles: ['https://tiles.planninglabs.nyc/pluto/{z}/{x}/{y}/tile.png'],
    tileSize: 256,
  },

  rasterLayer: {
    id: 'landuse-raster',
    type: 'raster',
    source: 'pluto-raster',
  },

  // actions: {
  //   handleMouseover(e) {
  //     const feature = e.target.queryRenderedFeatures(e.point, { layers: ['zoning'] })[0];
  //
  //     if (feature) {
  //       const { primaryzone } = feature.properties;
  //       e.target.getCanvas().style.cursor = 'pointer';
  //       this.set('mouseoverLocation', {
  //         x: e.point.x + 30,
  //         y: e.point.y,
  //       });
  //       this.set('tooltip-text', `${primaryzone}`);
  //     } else {
  //       e.target.getCanvas().style.cursor = '';
  //       this.set('mouseoverLocation', null);
  //     }
  //   },
  // },
});
