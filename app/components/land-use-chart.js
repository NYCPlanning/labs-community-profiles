import Ember from 'ember';
import carto from '../utils/carto';

const SQL = `
  WITH lots AS (
    SELECT a.the_geom, c.description as landuse
    FROM support_mappluto a
    INNER JOIN support_landuse_lookup c
          ON a.landuse::integer = c.code
    INNER JOIN support_admin_cdboundaries b
    ON ST_Contains(b.the_geom, a.the_geom)

    AND b.borocd = '102'
  ),
  totalsm AS (
    SELECT sum(ST_Area(the_geom::geography)) as total
    FROM lots
  )

  SELECT count(landuse), sum(ST_Area(the_geom::geography)) * 10.7639 as sqft, ROUND((sum(ST_Area(the_geom::geography))/totalsm.total)::numeric,4) as percent, landuse
  FROM lots, totalsm
  GROUP BY landuse, totalsm.total
  ORDER BY percent DESC
`;

const LandUseChart = Ember.Component.extend({
  didInsertElement: function() {
    console.log('didInsertElement');
    console.log(this);
    this.getData();
  },

  getData: function() {
    const self = this;
    carto.SQL(SQL)
      .then((data) => {
        self.set('data', data);
        self.createChart();
      });
  },

  createChart: function() {
    const el = this.$().get(0);
    console.log(el)
    const height = 400;
    const width = 400;

    const svg = d3.select(el).append('svg')
      .attr('class', 'chart')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid');

    this.set('chartSVG', svg);
  }

});

export default LandUseChart;
