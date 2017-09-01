import Ember from 'ember';
import HorizontalBar from '../components/horizontal-bar';

const translation = function(x,y) {
  return 'translate(' + x + ',' + y + ')';
};

export default HorizontalBar.extend({
  margin: {
    top: 20,
    right: 20,
    bottom: 24,
    left: 20,
    middle: 28,
  },
  height: 300,

  createChart: function createChart() {
    let svg = this.get('svg');
    const margin = this.get('margin');
    const el = this.$();
    const elWidth = el.width();
    const height = this.get('height') - margin.top - margin.bottom;
    const width = elWidth - margin.left - margin.right;

    if (!svg) {
      svg = d3.select(el.get(0)).append('svg')
        .attr('class', 'age-chart')
        .attr('width', margin.left + width + margin.right)
        .attr('height', margin.top + height + margin.bottom)
        .append('g')
        .attr('class', 'padding-group')
        .attr('transform', translation(margin.left, margin.top));

      svg.append('g')
        .attr('class', 'male');

      svg.append('g')
        .attr('class', 'female');

      svg.append('g')
        .attr('class', 'axis x-axis-left');

      svg.append('g')
        .attr('class', 'axis x-axis-right');

      svg.append('g')
        .attr('class', 'axis y-axis-left');
    }

    this.set('svg', svg);
    this.updateChart();
  },

  updateChart() {
    const svg = this.get('svg');
    const data = this.get('data');

    const el = this.$();
    const elWidth = el.width();

    const margin = this.get('margin');

    const height = this.get('height') - margin.top - margin.bottom;
    const width = elWidth - margin.left - margin.right;

    const regionWidth = (width / 2) - margin.middle;
    const pointA = regionWidth;
    const pointB = width - regionWidth;

    const percentage = function(d) { return d; };

    svg
      .attr('width', margin.left + width + margin.right)
      .attr('height', margin.top + height + margin.bottom);

    svg.select('.padding-group')
      .attr('transform', translation(margin.left, margin.top));

    const maxValue = Math.max(
      d3.max(data, function(d) { return percentage(d.male); }),
      d3.max(data, function(d) { return percentage(d.female); }),
    );

    const xScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, regionWidth])
      .nice();

    const yScale = d3.scaleBand()
      .domain(data.map(function(d) { return d.group; }))
      .range([height, 0], 0.1);

    const yAxisLeft = d3.axisRight()
      .scale(yScale)
      .tickSize(4, 0)
      .tickPadding(margin.middle - 4)
      .tickFormat(d => `${d.replace('_', ' - ')}`);

    const xAxisRight = d3.axisBottom()
      .scale(xScale)
      .ticks(4)
      .tickFormat(d => `${d}%`);

    const xAxisLeft = d3.axisBottom()
      .scale(xScale.copy().range([pointA, 0]))
      .ticks(4)
      .tickFormat(d => `${d}%`);

    const leftBarGroup = svg.select('.male')
      .attr('transform', `${translation(pointA, 0)}scale(-1,1)`)
      .selectAll('.bar.left')
      .data(data, d => d.group);

    const rightBarGroup = svg.select('.female')
      .attr('transform', translation(pointB, 0))
      .selectAll('.bar.right')
      .data(data, d => d.group);

    // DRAW AXES
    svg.select('.y-axis-left')
      .attr('transform', translation(pointA, 0))
      .call(yAxisLeft)
      .selectAll('text')
      .style('text-anchor', 'middle');

    svg.select('.x-axis-left')
      .attr('transform', translation(0, height))
      .call(xAxisLeft);

    svg.select('.x-axis-right')
      .attr('transform', translation(pointB, height))
      .call(xAxisRight);

    leftBarGroup.enter()
      .append('rect')
      .attr('class', 'bar left')
      .attr('x', 0)
      .attr('y', function(d) { return yScale(d.group); })
      .attr('height', yScale.step() - 3)
      .attr('width', function(d) { return xScale(percentage(d.male)); })
      .attr('rx', 2)
      .attr('ry', 2);

    leftBarGroup.transition().duration(300)
      .attr('y', function(d) { return yScale(d.group); })
      .attr('width', function(d) { return xScale(percentage(d.male)); })
      .attr('height', yScale.step() - 3);

    rightBarGroup
      .enter().append('rect')
      .attr('class', 'bar right')
      .attr('x', 0)
      .attr('y', function(d) { return yScale(d.group); })
      .attr('width', function(d) { return xScale(percentage(d.female)); })
      .attr('height', yScale.step() - 3);

    rightBarGroup.transition().duration(300)
      .attr('y', function(d) { return yScale(d.group); })
      .attr('width', function(d) { return xScale(percentage(d.female)); })
      .attr('height', yScale.step() - 3);

    leftBarGroup.exit().remove();
    rightBarGroup.exit().remove();
  },
});
