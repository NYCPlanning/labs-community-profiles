import Ember from 'ember'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line

import d3 from 'd3';
import landUseColors from '../utils/landUseColors';

export default Ember.Component.extend(ResizeAware, {
  classNames: ['land-use-chart'],

  resizeWidthSensitive: true,
  resizeHeightSensitive: true,

  data: [],
  column: '',

  height: 50,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  didRender() {
    const el = this.$();
    const elWidth = el.width();

    const margin = this.get('margin');
    const height = this.get('height') - margin.top - margin.bottom;
    const width = elWidth - margin.left - margin.right;

    let svg = this.get('svg');
    let div = this.get('tooltipDiv');

    if (!svg) {
      svg = d3.select(el.get(0)).append('svg')
        .attr('class', 'chart');
    }

    if (!div) {
      div = d3.select(el.get(0)).append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    }

    div
      .attr('class', 'tooltip')
      .style('opacity', 0);

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    this.set('svg', svg);
    this.set('tooltipDiv', div);
    this.set('height', height);
    this.set('width', width);

    this.updateChart();
  },

  updateChart() {
    const svg = this.get('svg');
    const div = this.get('tooltipDiv');
    const height = this.get('height');
    const width = this.get('width');
    const data = this.get('data');
    const column = this.get('column');
    const rank = this.get('rank');

    Promise.all([data, rank]).then(resolve => {
      const [data, rank] = resolve;

      const x = d3.scaleBand()
        .domain(data.map(d => d.borocd))
        .range([0, width])
        .paddingOuter(0)
        .paddingInner(0.2);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[column])])
        .range([0, height]);

      const bars = svg.selectAll('.bar')
        .data(data);

      bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('fill', function(d,i) {
          return (i === rank) ? 'red' : 'blue';
        })
        .attr('y', 0)
        .attr('width', 10)
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('x', d => x(d.borocd))
        .attr('height', d => y(d[column]))
        .on("mouseover", function(d) {
          console.log('test');
          div.transition()
            .duration(200)
            .style('opacity', 0.9);
          div.html('test')
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', function(d) {
          div.transition()
            .duration(500)
            .style('opacity', 0);
        });

      bars.transition().duration(300)
        .attr('fill', function(d,i) {
          return (i === rank) ? 'red' : 'blue';
        });

      bars.exit().remove();
    });
  },
});
