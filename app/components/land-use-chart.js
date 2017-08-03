import Ember from 'ember'; // eslint-disable-line
import carto from '../utils/carto';
import landUseColors from '../utils/landUseColors';

const SQL = `
  WITH lots AS (
    SELECT a.the_geom, c.description as landuse_desc, c.code as landuse
    FROM support_mappluto a
    INNER JOIN support_landuse_lookup c
          ON a.landuse::integer = c.code
    INNER JOIN support_admin_cdboundaries b
    ON ST_Contains(b.the_geom, a.the_geom)

    AND b.borocd = '101'
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

const LandUseChart = Ember.Component.extend({
  didInsertElement: function didInsertElement() {
    this.getData();
  },

  getData: function getData() {
    const self = this;
    carto.SQL(SQL)
      .then((data) => {
        console.log(data)
        self.set('data', data);
        self.createChart();
      });
  },

  createChart: function createChart() {
    const el = this.element;

    const margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 200,
    };
    const height = 400 - margin.top - margin.bottom;
    const width = 400 - margin.left - margin.right;

    const data = this.get('data');

    const svg = d3.select(el).append('svg')
      .attr('class', 'chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const y = d3.scaleBand()
      .domain(data.map(d => d.landuse_desc))
      .range([height, 0])
      .paddingOuter(0.5)
      .paddingInner(0.2);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.percent)])
      .range([width - 40, 40]);


    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
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
      .attr('x', -8)
      .attr('y', d => y(d.landuse_desc) + (y.bandwidth() / 2))
      .text(d => d.landuse_desc);
  },
});

export default LandUseChart;
