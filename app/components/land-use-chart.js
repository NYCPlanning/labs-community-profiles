import Ember from 'ember'; // eslint-disable-line
import carto from '../utils/carto';

const SQL = `
  WITH lots AS (
    SELECT a.the_geom, c.description as landuse
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

  SELECT count(landuse), sum(ST_Area(the_geom::geography)) * 10.7639 as sqft, ROUND((sum(ST_Area(the_geom::geography))/totalsm.total)::numeric,4) as percent, landuse
  FROM lots, totalsm
  GROUP BY landuse, totalsm.total
  ORDER BY percent DESC
`;

const LandUseChart = Ember.Component.extend({
  didInsertElement: function didInsertElement() {
    console.log('didInsertElement');
    console.log(this);
    this.getData();
  },

  getData: function getData() {
    const self = this;
    carto.SQL(SQL)
      .then((data) => {
        console.log(data);
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
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr('style', 'background:#d8d8d8;')
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const y = d3.scaleBand()
      .domain(data.map(d => d.landuse))
      .range([height, 0])
      .paddingOuter(0.5)
      .paddingInner(0.2);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.percent)])
        .range([width - 40, 40]);




    const yAxis = d3.axisLeft(y);

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
  .append("text")
    .attr("class", "label")
    .attr("transform", "translate(" + width + ",0)")
    .attr("y", -5)
    .style("text-anchor", "end")
    .text("Frequency");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

svg.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("height", y.bandwidth())
    .attr("y", function(d) { return y(d.landuse); })
    .attr("width", function(d) { return x(d.percent); });
    //this.set('chartSVG', svg);
  },

});

export default LandUseChart;
