import { computed } from '@ember/object'; // eslint-disable-line
import FacilitiesSection from './facilities-section';
import carto from '../utils/carto';

const floodplain100SQL = 'SELECT the_geom_webmercator, fld_zone FROM merged_pfirm_firm_100yr WHERE fld_zone = \'AE\' OR fld_zone = \'VE\'';
const floodplain500SQL = 'SELECT * FROM merged_pfirm_firm_500yr';

const floodplain100Layer = {
  id: 'floodplain100',
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

const floodplain500Layer = {
  id: 'floodplain500',
  source: 'floodzones',
  'source-layer': 'layer1',
  type: 'fill',
  paint: {
    'fill-color': '#EDCD85',
    'fill-opacity': 1,
    'fill-antialias': true,
  },
};

export default FacilitiesSection.extend({
  floodplainTemplate: null,
  vectorSource: computed('floodplainTemplate', function () {
    return carto.getVectorTileTemplate([floodplain100SQL, floodplain500SQL])
      .then(template => ({
        type: 'vector',
        tiles: [template],
      }));
  }),

  fitBoundsOptions: {
    linear: true,
    duration: 0,
  },

  floodplain100Layer,

  floodplain500Layer,

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
