import Ember from 'ember'; // eslint-disable-line
import carto from '../utils/carto';
import landUseColors from '../utils/landUseColors';

const LandUseChart = Ember.Component.extend({
  didInsertElement: function didInsertElement() {
    this.getData();
  },

  borocd: '',
  sql: Ember.computed('borocd', function sql() {
    const borocd = this.get('borocd');
    const SQL = `
      WITH lots AS (
        SELECT a.the_geom, c.description as landuse_desc, c.code as landuse
        FROM support_mappluto a
        INNER JOIN support_landuse_lookup c
              ON a.landuse::integer = c.code
        INNER JOIN support_admin_cdboundaries b
        ON ST_Contains(b.the_geom, a.the_geom)

        AND b.borocd = '${borocd}'
      ),
      totalsm AS (
        SELECT sum(ST_Area(the_geom::geography)) as total
        FROM lots
      )

      SELECT count(landuse), sum(ST_Area(the_geom::geography)) * 10.7639 as sqft, ROUND((sum(ST_Area(the_geom::geography))/totalsm.total)::numeric,4) as percent, landuse, landuse_desc
      FROM lots, totalsm
      GROUP BY landuse, landuse_desc, totalsm.total
      ORDER BY percent DESC
    `;

    return SQL;
  }),

  getData: function getData() {
    const self = this;
    const sql = this.get('sql');

    carto.SQL(sql)
      .then((data) => {
        self.set('data', data);
        self.createChart();
      });
  },

  createChart: function createChart() {
    const el = this.$();
    const elWidth = el.width();

    const margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
    const height = 400 - margin.top - margin.bottom;
    const width = elWidth - margin.left - margin.right;

    const data = this.get('data');

    const svg = d3.select(el.get(0)).append('svg')
      .attr('class', 'chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const y = d3.scaleBand()
      .domain(data.map(d => d.landuse_desc))
      .range([0, height])
      .paddingOuter(0)
      .paddingInner(0.2);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.percent)])
      .range([0, width / 2]);


    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', width / 2)
      .attr('fill', d => landUseColors(d.landuse))
      .attr('height', y.bandwidth())
      .attr('y', d => y(d.landuse_desc))
      .attr('width', d => x(d.percent));

    svg.selectAll('text')
      .data(data)
      .enter().append('text')
      .attr('class', 'label')
      .attr('text-anchor', 'end')
      .attr('alignment-baseline', 'middle')
      .attr('x', (width / 2) - 8)
      .attr('y', d => y(d.landuse_desc) + (y.bandwidth() / 2))
      .text(d => d.landuse_desc);
  },
});

export default LandUseChart;
