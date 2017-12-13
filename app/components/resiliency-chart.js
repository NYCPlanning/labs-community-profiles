import { computed } from '@ember/object';
import RankingChart from '../components/ranking-chart';
import carto from '../utils/carto';

export default RankingChart.extend({
  tooltip(d, current) {
    const selected = current || d;
    const { column, overlayColumn } = this.getProperties('column', 'overlayColumn');
    const denominator = selected[column];
    const numerator = selected[overlayColumn];
    const percent = this.get('percent');
    return `${selected.boro_district}: <strong>${percent(numerator / denominator * 100)}%</strong> <span class='moe-text'>of ${this.get('unit') || 'buildings'} are in floodplain</span>`;
  },
  colors: {
    gray: '#dddddd',
    web_safe_orange: '#a24c0e',
    dcp_orange: '#de7d2c',
    curr: '#60acbf',
  },
  sql: computed('borocd', function() {
    const { column, overlayColumn } =
      this.getProperties('column', 'overlayColumn');

    return `SELECT ${column}, ${overlayColumn || 1},
      CASE
        WHEN LEFT(borocd::text, 1) = '1' THEN 'Manhattan ' || borocd %25 100
        WHEN LEFT(borocd::text, 1) = '2' THEN 'Bronx ' || borocd %25 100
        WHEN LEFT(borocd::text, 1) = '3' THEN 'Brooklyn ' || borocd %25 100
        WHEN LEFT(borocd::text, 1) = '4' THEN 'Queens ' || borocd %25 100
        WHEN LEFT(borocd::text, 1) = '5' THEN 'Staten Island ' || borocd %25 100
      END as boro_district,
      borocd
      FROM community_district_profiles`;
  }),
  data: computed('sql', function() {
    const sql = this.get('sql');
    const borocd = this.get('borocd');
    return carto.SQL(sql, 'json').then(data => {
      return data.sortBy(this.get('overlayColumn')).reverse().map(d => {
        d.is_selected = (borocd === d.borocd) ? true : false;
        return d;
      });
    });
  }),
});
