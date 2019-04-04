import computed from 'ember-computed-decorators';
import Component from '@ember/component'; // eslint-disable-line
import fetch from 'fetch'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import carto from '../utils/carto';


const BuildingAgeChart = Component.extend(ResizeAware, {
  classNames: ['relative'],
  borocd: '',

  @computed('borocd', 'mode')
  sql(borocd, mode) {
    const modePrefix = mode === '100-yr' ? '1' : '5';
    return `
      SELECT
        yb${modePrefix}01 AS "Pre-1961",
        yb${modePrefix}02 AS "1961-1982",
        yb${modePrefix}03 AS "1983-2012",
        yb${modePrefix}04 AS "2013-2017"
      FROM planninglabs.cd_floodplains
      WHERE borocd = ${borocd}
    `;
  },

  @computed('sql', 'borocd')
  data() {
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
  },
});

export default BuildingAgeChart;
