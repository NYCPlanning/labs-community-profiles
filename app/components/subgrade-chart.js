import Ember from 'ember'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line

import carto from '../utils/carto';

const LandUseChart = Ember.Component.extend(ResizeAware, {
  classNames: ['subgrade-space-chart'],
  borocd: '',
  sql: Ember.computed('borocd', function sql() {
    const borocd = this.get('borocd');
    const SQL = `
    SELECT
      count(subgrade_space) AS value, subgrade_space AS group
    FROM (
    SELECT
      CASE
        WHEN landuse IN ('01','02','03') AND bsmtcode IN ('2','4') THEN 'Residential, full basement below grade'
    WHEN landuse IN ('04','05','06','07','08','09','10','11') AND bsmtcode IN ('2','4') THEN 'Non-residential, full basement below grade'
        WHEN landuse IN ('01','02','03','04','05','06','07','08','09','10','11') AND bsmtcode = '5' THEN 'Sturcture with Unknown Basement Type'
      END AS subgrade_space,
      SUM (numbldgs) OVER () as totalbuildings
      FROM support_mappluto a
      INNER JOIN support_admin_cdboundaries b
      ON ST_Contains(b.the_geom, a.the_geom)
      AND b.borocd = '${borocd}'
      INNER JOIN support_waterfront_pfirm15 c
      ON ST_Intersects(a.the_geom, c.the_geom)
      AND (fld_zone = 'AE' OR fld_zone = 'VE')
        ) x
    WHERE subgrade_space IS NOT NULL
    GROUP BY subgrade_space
    ORDER BY array_position(array['Residential, full basement below grade', 'Non-residential, full basement below grade', 'Sturcture with Unknown Basement Type'], subgrade_space)

    `;

    return SQL;
  }),

  data: Ember.computed('sql', 'borocd', function() {
    const sql = this.get('sql');
    return carto.SQL(sql);
  }),
});

export default LandUseChart;
