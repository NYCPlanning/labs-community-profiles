import Ember from 'ember';
import FacilitiesSection from '../components/facilities-section';
import carto from '../utils/carto';

const SQL = 'SELECT *, LEFT(overlay, 2) as primaryzone FROM support_zoning_co UNION ALL SELECT *, LEFT(zonedist, 2) as primaryzone FROM support_zoning_zd';
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
        ['C1', '#FDBDBB'],
        ['C2', '#FDBDBB'],
        ['C3', '#FDBDBB'],
        ['C4', '#FDBDBB'],
        ['C5', '#FDBDBB'],
        ['C6', '#FDBDBB'],
        ['C7', '#FDBDBB'],
        ['C8', '#FDBDBB'],
        ['M1', '#B7D6FD'],
        ['M2', '#EDB7FD'],
        ['M3', '#EDB7FD'],
        ['PA', '#E7FDDC'],
        ['R1', '#FDFDDC'],
        ['R2', '#FDFDDC'],
        ['R3', '#FDFDDC'],
        ['R4', '#FDFDDC'],
        ['R5', '#FDFDDC'],
        ['R6', '#FDE7BD'],
        ['R7', '#FDE7BD'],
        ['R8', '#FDE7BD'],
        ['R9', '#FDE7BD'],
      ],
    },
    'fill-opacity': 0.6,
    'fill-antialias': true,
    'fill-outline-color': 'rgba(0, 0, 0, 1)',
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
  sql: Ember.computed('borocd', function sql() {
    const borocd = this.get('borocd');
    const joinSql = `
      SELECT COUNT(primaryzone), primaryzone FROM
      (${SQL}) a
      GROUP BY primaryzone
      ORDER BY count DESC
      LIMIT 7;
    `;

    return joinSql;
  }),
  data: Ember.computed('sql', 'borocd', function() {
    const sql = this.get('sql');
    return carto.SQL(sql)
      .then((data) => { // eslint-disable-line
        return data.map((d) => {
          const dWithColor = d;
          dWithColor.color = zdConfig.paint['fill-color'].stops.find(el => el[0] === d.primaryzone)[1];
          return dWithColor;
        });
      });
  }),
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
