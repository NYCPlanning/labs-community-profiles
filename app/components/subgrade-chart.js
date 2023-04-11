import { computed } from '@ember/object';
import Component from '@ember/component';
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import carto from '../utils/carto';


const LandUseChart = Component.extend(ResizeAware, {
  classNames: ['relative'],
  borocd: '',

  sql: computed('borocd', 'mode', function() {
    const borocd = this.get('borocd');
    const modePrefix = this.get('mode') === '100-yr' ? '1' : '5';

    return `
      SELECT
        bm${modePrefix}bg AS "Full basement below grade",
        bm${modePrefix}ag AS "Full basement above grade",
        bm${modePrefix}un AS "Unknown"
      FROM planninglabs.cd_floodplains
      WHERE borocd = ${borocd}
    `;
  }),

  data: computed('sql', 'borocd', async function() {
    const sql = this.get('sql');
    return carto.SQL(sql, 'json')
      .then((rawData) => {
        const data = rawData[0];
        const total = Object.keys(data)
          .map(key => data[key])
          .reduce((acc, curr) => acc + curr);

        return Object.keys(data)
          .map((key) => {
            const group = key;
            const value = data[key] || 0;
            const value_pct = value / total; // eslint-disable-line
            return {
              group,
              value,
              value_pct,
            };
          });
      });
  }),
});

export default LandUseChart;
