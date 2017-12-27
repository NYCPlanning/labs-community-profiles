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
    const modePrefix = mode === '2015' ? 'cur' : 'fut';
    return `
      SELECT
        ${modePrefix}_age_pre_1961 AS "Pre-1961",
        ${modePrefix}_age_1961_1982 AS "1961-1982",
        ${modePrefix}_age_1983_2012 AS "1983-2012",
        ${modePrefix}_age_2013_2016 AS "2013-2016",
        ${modePrefix}_age_unk AS "Unknown"
      FROM planninglabs.community_profiles_floodplain
      WHERE borocd = ${borocd}
    `;
  },

  @computed('sql', 'borocd')
  data() {
    const sql = this.get('sql');
    return carto.SQL(sql, 'json')
      .then((rawData) => {
        const data = rawData[0];
        const total = Object.keys(data).reduce((acc, curr) => acc + curr);

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
