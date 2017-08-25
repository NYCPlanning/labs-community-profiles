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
        ['BP', '#EEEEEE'],
        ['C1', '#ffb2b0'],
        ['C2', '#ff9997'],
        ['C3', '#ff7f7e'],
        ['C4', '#ff6665'],
        ['C5', '#ff4c4b'],
        ['C6', '#ff3332'],
        ['C7', '#ff1919'],
        ['C8', '#ff0000'],
        ['M1', '#B7D6FD'],
        ['M2', '#EDB7FD'],
        ['M3', '#EDB7FD'],
        ['PA', '#E7FDDC'],
        ['R1', '#fdffb0'],
        ['R2', '#fcff9a'],
        ['R3', '#fbff84'],
        ['R4', '#faff6e'],
        ['R5', '#faff58'],
        ['R6', '#f9ff42'],
        ['R7', '#f8ff2c'],
        ['R8', '#f7ff16'],
        ['R9', '#f6ff00'],
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
    return carto.getTileTemplate(SQL)
      .then(zoningTemplate => ({
        type: 'vector',
        tiles: [zoningTemplate],
      }));
  }),
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
