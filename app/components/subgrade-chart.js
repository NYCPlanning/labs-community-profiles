import computed from 'ember-computed-decorators';
import Component from '@ember/component';
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import carto from '../utils/carto';


const LandUseChart = Component.extend(ResizeAware, {
  classNames: ['relative'],
  borocd: '',

  @computed('borocd', 'mode')
  sql(borocd, mode) {
    const modePrefix = mode === '2015' ? 'cur' : 'fut';

    return `
      SELECT
        ${modePrefix}_sub_fulla AS "Residential, full basement below grade",
        ${modePrefix}_sub_fullb AS "Non-residential, full basement below grade",
        ${modePrefix}_sub_unk AS "Unknown"
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

export default LandUseChart;
