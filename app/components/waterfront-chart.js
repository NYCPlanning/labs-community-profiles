import Ember from 'ember'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import fetch from 'fetch'; // eslint-disable-line

import landUseColors from '../utils/landUseColors';

const LandUseChart = Ember.Component.extend(ResizeAware, {
  classNameBindings: ['loading'],
  classNames: ['land-use-chart'],

  resizeWidthSensitive: true,
  resizeHeightSensitive: true,
  loading: false,

  borocd: '',

  data: Ember.computed('borocd', function() {
    const borocd = this.get('borocd');
    return fetch(`/data/floodplain_chart/${borocd}.json`)
      .then(data => data.json());
  }),

  didRender() {
    this.createChart();
  },

  debouncedDidResize(width) {
    this.set('width', width);
    this.updateChart();
  },

  createChart: function createChart() {
    let svg = this.get('svg');

    if (!svg) {
      const el = this.$();
      svg = d3.select(el.get(0)).append('svg')
        .attr('class', 'chart');
    }

    this.set('svg', svg);
    this.updateChart();
  },

  updateChart: function updateChart() {
    const svg = this.get('svg');
    const data = this.get('data');
    console.log('DATA', data);

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

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    data.then((rawData) => {
      const y = d3.scaleBand()
        .domain(rawData.map(d => d.landuse_desc))
        .range([0, height])
        .paddingOuter(0)
        .paddingInner(0.2);

      const x = d3.scaleLinear()
        .domain([0, d3.max(rawData, d => d.percent)])
        .range([0, width]);


      const bars = svg.selectAll('.bar')
        .data(rawData, d => d.landuse);

      bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('fill', d => landUseColors(d.landuse))
        .attr('x', 0)
        .attr('height', y.bandwidth() - 15)
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('y', d => y(d.landuse_desc))
        .attr('width', d => x(d.percent));


      bars.transition().duration(300)
        .attr('height', y.bandwidth() - 15)
        .attr('y', d => y(d.landuse_desc))
        .attr('width', d => x(d.percent));

      bars.exit().remove();

      const labels = svg.selectAll('text')
        .data(rawData, d => d.landuse);

      labels.enter().append('text')
        .attr('class', 'label')
        .attr('text-anchor', 'left')
        .attr('alignment-baseline', 'top')
        .attr('x', 0)
        .attr('y', d => y(d.landuse_desc) + y.bandwidth() + -3)
        .text(d => `${d.landuse_desc} | ${(d.percent * 100).toFixed(2)}%`);

      labels.transition().duration(300)
        .attr('y', d => y(d.landuse_desc) + y.bandwidth() + -3)
        .text(d => `${d.landuse_desc} | ${(d.percent * 100).toFixed(2)}%`);

      labels.exit().remove();
    });
  },
});

export default LandUseChart;
