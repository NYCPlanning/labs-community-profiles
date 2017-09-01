import Ember from 'ember'; // eslint-disable-line
import FacilitiesSection from '../components/facilities-section';
import carto from '../utils/carto';

const SQL = 'SELECT *, LEFT(zonedist, 2) as primaryzone FROM support_zoning_zd';
const zdConfig = {
  id: 'zoning',
  type: 'fill',
  source: 'zoning',
  'source-layer': 'layer0',
  paint: {
    'fill-color': {
      property: 'primaryzone',
      type: 'categorical',
      stops: [
        ['BP', '#666666'],
        ['C1', '#ff0000'],
        ['C2', '#ff0000'],
        ['C3', '#ff0000'],
        ['C4', '#ff0000'],
        ['C5', '#ff0000'],
        ['C6', '#ff0000'],
        ['C7', '#ff0000'],
        ['C8', '#ff0000'],
        ['M1', '#E362FB'],
        ['M2', '#E362FB'],
        ['M3', '#E362FB'],
        ['PA', '#78D271'],
        ['R1', '#F2F618'],
        ['R2', '#F2F618'],
        ['R3', '#F2F618'],
        ['R4', '#F2F618'],
        ['R5', '#F2F618'],
        ['R6', '#F2F618'],
        ['R7', '#F2F618'],
        ['R8', '#F2F618'],
        ['R9', '#F2F618'],
      ],
    },
    'fill-opacity': 0.4,
    'fill-antialias': true,
    'fill-outline-color': '#444',
  },
};

const paint = {
  labels: {
    'text-color': '#626262',
    'text-halo-color': '#FFFFFF',
    'text-halo-width': 2,
    'text-halo-blur': 2,
  },
  co_labels: {
    'text-color': 'rgba(255, 0, 0, 1)',
    'text-halo-color': '#FFFFFF',
    'text-halo-width': 2,
    'text-halo-blur': 2,
  },
};

const zdLabelConfig = {
  id: 'zd_labels',
  source: 'zoning',
  type: 'symbol',
  'source-layer': 'layer0',
  paint: paint.labels,
  layout: {
    'symbol-placement': 'point',
    'text-field': '{zonedist}',
  },
  minzoom: 14,
};

export default FacilitiesSection.extend({
  vectorSource: Ember.computed('zoningTemplate', function () {
    return carto.getVectorTileTemplate([SQL])
      .then(zoningTemplate => ({
        type: 'vector',
        tiles: [zoningTemplate],
      }));
  }),

  fitBoundsOptions: {
    linear: true,
    duration: 0,
  },

  pointsLayer: zdConfig,

  zoningLabelsLayer: zdLabelConfig,

  actions: {
    handleMouseover(e) {
      const feature = e.target.queryRenderedFeatures(e.point, { layers: ['zoning'] })[0];

      if (feature) {
        const { primaryzone } = feature.properties;
        e.target.getCanvas().style.cursor = 'pointer';
        this.set('mouseoverLocation', {
          x: e.point.x + 30,
          y: e.point.y,
        });
        this.set('tooltip-text', `${primaryzone}`);
      } else {
        e.target.getCanvas().style.cursor = '';
        this.set('mouseoverLocation', null);
      }
    },
  },
});
