import Ember from 'ember'; // eslint-disable-line
import fetch from 'fetch'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import githubraw from '../utils/githubraw';


const BuildingAgeChart = Ember.Component.extend(ResizeAware, {
  classNames: ['relative'],
  borocd: '',
  sql: Ember.computed('borocd', function sql() {
    const borocd = this.get('borocd');
    const SQL = `
    SELECT
      sum(numbldgs) as value, building_age as group,
      ROUND(count(building_age)::numeric / totalbuildings, 4) AS value_pct
    FROM (
      SELECT
      CASE
        WHEN yearbuilt > 0 AND yearbuilt < 1961  THEN 'Pre-1961'
        WHEN yearbuilt >= 1961 AND YearBuilt < 1983 THEN '1961-1982'
        WHEN yearbuilt >= 1983 AND YearBuilt < 2013 THEN '1983-2012'
        WHEN yearbuilt >= 2013 THEN '2013-Present'
        ELSE 'Unknown'
      END AS building_age,
      numbldgs,
      SUM (numbldgs) OVER () as totalbuildings
      FROM support_mappluto a
      INNER JOIN support_admin_cdboundaries b
      ON ST_Contains(b.the_geom, a.the_geom)
      AND b.borocd = '${borocd}'
      INNER JOIN support_waterfront_pfirm15 c
      ON ST_Intersects(a.the_geom, c.the_geom)
      AND (fld_zone = 'AE' OR fld_zone = 'VE')
    ) x
    GROUP BY building_age, totalbuildings
    ORDER BY array_position(array['Pre-1961','1961-1982','1983-2012','2013-Present','Unknown'], building_age)
    `;

    return SQL;
  }),

  data: Ember.computed('sql', 'borocd', function() {
    const borocd = this.get('borocd');
    return githubraw('building_age', borocd);
  }),
});

export default BuildingAgeChart;
