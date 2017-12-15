import computed from 'ember-computed-decorators';
import Component from '@ember/component';
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import githubraw from '../utils/githubraw';
import carto from '../utils/carto';


const LandUseChart = Component.extend(ResizeAware, {
  classNames: ['relative'],
  borocd: '',
  datasetName: 'subgrade_space',

  @computed('borocd')
  sql(borocd) {
    return `
      SELECT
        sum(numbldgs) as value, building_age as group,
        CASE WHEN totalbuildings > 0 THEN ROUND(count(building_age)::numeric / NULLIF(totalbuildings,0), 3) ELSE NULL END AS value_pct
      FROM (
        WITH floodplain AS (
            SELECT * FROM support_waterfront_pfirm15 WHERE fld_zone = 'AE' OR fld_zone = 'VE'
        )

        SELECT
          CASE
            WHEN unitsres > 0 AND proxcode = '1'  THEN 'Detached'
            WHEN unitsres > 0 AND (proxcode = '2' OR proxcode = '3') THEN 'Attached or Semi-detached'
            ELSE 'Unknown'
          END AS building_age,
          numbldgs,
          SUM (numbldgs) OVER () as totalbuildings
        FROM support_mappluto a, floodplain b
        WHERE cd = ${borocd} AND ST_Within(a.the_geom, b.the_geom)
      ) x
      GROUP BY building_age, totalbuildings
      ORDER BY array_position(array%5B'Detached','Attached or Semi-detached','Unknown'%5D, building_age)
    `;
  },

  @computed('sql', 'borocd')
  data() {
    const sql = this.get('sql');
    return carto.SQL(sql, 'json');
  },
});

export default LandUseChart;
