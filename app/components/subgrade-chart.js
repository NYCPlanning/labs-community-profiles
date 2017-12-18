import computed from 'ember-computed-decorators';
import Component from '@ember/component';
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import carto from '../utils/carto';


const LandUseChart = Component.extend(ResizeAware, {
  classNames: ['relative'],
  borocd: '',
  datasetName: 'subgrade_space',

  @computed('borocd', 'floodplainSQL')
  sql(borocd, floodplainSQL) {
    return `
      SELECT
        count(subgrade_space) AS value,
        subgrade_space AS group
      FROM (
        WITH floodplain AS (
            ${floodplainSQL}
        )

        SELECT
          CASE
            WHEN landuse IN ('01','02','03') AND bsmtcode IN ('2','4') THEN 'Residential, full basement below grade'
            WHEN landuse IN ('04','05','06','07','08','09','10','11') AND bsmtcode IN ('2','4') THEN 'Non-residential, full basement below grade'
            WHEN landuse IN ('01','02','03','04','05','06','07','08','09','10','11') AND bsmtcode = '5' THEN 'Structure with Unknown Basement Type'
          END AS subgrade_space,
          SUM (numbldgs) OVER () as totalbuildings
        FROM support_mappluto a, floodplain b
        WHERE cd = ${borocd} AND landuse = '01' AND ST_Within(a.the_geom, b.the_geom)
      ) x
      WHERE subgrade_space IS NOT NULL
      GROUP BY subgrade_space
      ORDER BY array_position(array%5B'Residential, full basement below grade', 'Non-residential, full basement below grade', 'Structure with Unknown Basement Type'%5D, subgrade_space)
    `;
  },

  @computed('sql', 'borocd')
  data() {
    const sql = this.get('sql');
    return carto.SQL(sql, 'json');
  },
});

export default LandUseChart;
