import computed from 'ember-computed-decorators';
import Component from '@ember/component'; // eslint-disable-line
import fetch from 'fetch'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import carto from '../utils/carto';



const BuildingAgeChart = Component.extend(ResizeAware, {
  classNames: ['relative'],
  borocd: '',

  @computed('borocd')
  sql(borocd) {
    return `
    SELECT
      sum(numbldgs) as value, building_age as group,
      CASE WHEN totalbuildings %3E 0 THEN ROUND(count(building_age)::numeric / NULLIF(totalbuildings,0), 4) ELSE NULL END AS value_pct
    FROM (
      WITH floodplain AS (
          SELECT * FROM support_waterfront_pfirm15 WHERE fld_zone = 'AE' OR fld_zone = 'VE'
      )

      SELECT
        CASE
          WHEN yearbuilt %3E 0 AND yearbuilt %3C 1961  THEN 'Pre-1961'
          WHEN yearbuilt %3E= 1961 AND YearBuilt %3C 1983 THEN '1961-1982'
          WHEN yearbuilt %3E= 1983 AND YearBuilt %3C 2013 THEN '1983-2012'
          WHEN yearbuilt %3E= 2013 THEN '2013-Present'
          ELSE 'Unknown'
        END AS building_age,
        numbldgs,
        SUM (numbldgs) OVER () as totalbuildings
      FROM support_mappluto a, floodplain b
      WHERE cd = ${borocd} AND ST_Within(a.the_geom, b.the_geom)
    ) x
    GROUP BY building_age, totalbuildings
    ORDER BY array_position(array%5B'Pre-1961','1961-1982','1983-2012','2013-Present','Unknown'%5D, building_age)
    `;
  },

  @computed('sql', 'borocd')
  data() {
    const sql = this.get('sql');
    return carto.SQL(sql, 'json');
  },
});

export default BuildingAgeChart;
