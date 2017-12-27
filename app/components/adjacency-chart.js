import computed from 'ember-computed-decorators';
import Component from '@ember/component';
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import carto from '../utils/carto';


const LandUseChart = Component.extend(ResizeAware, {
  classNames: ['relative'],
  borocd: '',
  datasetName: 'subgrade_space',

  @computed('borocd', 'mode')
  sql(borocd, mode) {
    const modePrefix = mode === '2015' ? 'cur' : 'fut';

    return `
      SELECT
        ${modePrefix}_adj_det AS "Detached",
        ${modePrefix}_adj_semi AS "Attached or Semi-detached",
        ${modePrefix}_adj_unk AS "Unknown"
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
            const value = data[key];
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
