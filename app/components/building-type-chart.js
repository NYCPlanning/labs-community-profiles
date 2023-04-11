import { computed } from '@ember/object';
import Component from '@ember/component'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import carto from '../utils/carto';
import buildingTypeLookup from '../utils/building-type-lookup';


const BuildingTypeChart = Component.extend(ResizeAware, {
  classNameBindings: ['loading'],
  classNames: ['relative'],

  resizeWidthSensitive: true,
  resizeHeightSensitive: true,
  loading: false,
  borocd: '',

  sql: computed('borocd', 'type', 'mode', function() {
    const modePrefix = this.get('mode') === '100-yr' ? '1' : '5';
    const typeAbbrev = this.get('type') === 'buildings' ? 'bt' : 'du';
    return `
      SELECT
        ${typeAbbrev}${modePrefix}01 AS "1",
        ${typeAbbrev}${modePrefix}02 AS "2",
        ${typeAbbrev}${modePrefix}03 AS "3",
        ${typeAbbrev}${modePrefix}04 AS "4",
        ${typeAbbrev}${modePrefix}05 AS "5",
        ${typeAbbrev}${modePrefix}06 AS "6",
        ${typeAbbrev}${modePrefix}07 AS "7",
        ${typeAbbrev}${modePrefix}08 AS "8",
        ${typeAbbrev}${modePrefix}09 AS "9",
        ${typeAbbrev}${modePrefix}10 AS "10",
        ${typeAbbrev}${modePrefix}11 AS "11"
      FROM planninglabs.cd_floodplains
      WHERE borocd = ${this.get('borocd')}
    `;
  }),

  data: computed('sql', 'borocd', function() {
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
              group: buildingTypeLookup(group).description,
              color: buildingTypeLookup(group).color,
              value,
              value_pct,
            };
          });
      });
  }),
});

export default BuildingTypeChart;
