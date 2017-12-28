import computed from 'ember-computed-decorators';
import Component from '@ember/component'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import carto from '../utils/carto';
import landUseLookup from '../utils/land-use-lookup';


const BuildingTypeChart = Component.extend(ResizeAware, {
  classNameBindings: ['loading'],
  classNames: ['relative'],

  resizeWidthSensitive: true,
  resizeHeightSensitive: true,
  loading: false,
  borocd: '',

  @computed('borocd', 'type', 'mode')
  sql(borocd, type, mode) {
    const modePrefix = mode === '2015' ? 'cur' : 'fut';
    const typeAbbrev = type === 'buildings' ? 'b' : 'du';
    return `
      SELECT
        ${modePrefix}_${typeAbbrev}_lu01 AS "1",
        ${modePrefix}_${typeAbbrev}_lu02 AS "2",
        ${modePrefix}_${typeAbbrev}_lu03 AS "3",
        ${modePrefix}_${typeAbbrev}_lu04 AS "4",
        ${modePrefix}_${typeAbbrev}_lu05 AS "5",
        ${modePrefix}_${typeAbbrev}_lu06 AS "6",
        ${modePrefix}_${typeAbbrev}_lu07 AS "7",
        ${modePrefix}_${typeAbbrev}_lu08 AS "8",
        ${modePrefix}_${typeAbbrev}_lu10 AS "10",
        ${modePrefix}_${typeAbbrev}_lu11 AS "11"
      FROM planninglabs.community_profiles_floodplain
      WHERE borocd = ${borocd}
    `;
  },

  @computed('sql', 'borocd')
  data() {
    const sql = this.get('sql');
    return carto.SQL(sql)
      .then((rawData) => { // eslint-disable-line
        const data = rawData[0];
        const total = Object.keys(data)
          .map(key => data[key])
          .reduce((acc, curr) => acc + curr);

        return Object.keys(data)
          .map((key) => {
            const group = parseInt(key, 10);
            const value = data[key];
            const value_pct = value / total; // eslint-disable-line
            return {
              group: landUseLookup(group).description,
              color: landUseLookup(group).color,
              value,
              value_pct,
            };
          })
          .sort((a, b) => { // eslint-disable-line
            return a.value === b.value ? 0 : -(a.value > b.value) || 1;
          });
      });
  },
});

export default BuildingTypeChart;
