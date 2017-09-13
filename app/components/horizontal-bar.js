import Ember from 'ember'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import numeral from 'numeral';

const HorizontalBar = Ember.Component.extend(ResizeAware, {
  classNameBindings: ['loading'],
  classNames: ['horizontal-bar'],

  height: 400,
  xMax: null,
  resizeWidthSensitive: true,
  resizeHeightSensitive: true,
  loading: false,
  barLabel: true,

  data: [],

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
    const barLabel = this.get('barLabel');

    const el = this.$();
    const elWidth = el.width();

    const margin = {
      top: 0,
      right: barLabel ? 50 : 0,
      bottom: 0,
      left: 0,
    };
    const height = this.get('height') - margin.top - margin.bottom;
    const width = elWidth - margin.left - margin.right;

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    Promise.resolve(data).then((rawData) => {
      const y = d3.scaleBand()
        .domain(rawData.map(d => d.group))
        .range([0, height])
        .paddingOuter(0)
        .paddingInner(0.1);

      const x = d3.scaleLinear()
        .domain([0, this.get('xMax') ? this.get('xMax') : d3.max(rawData, d => d.value)])
        .range([0, width]);

      const groupLabels = svg.selectAll('.typelabel')
        .data(rawData, d => d.group);

      groupLabels.enter().append('text')
        .attr('class', 'label typelabel')
        .attr('text-anchor', 'left')
        .attr('alignment-baseline', 'top')
        .attr('x', 0);

      groupLabels.transition().duration(300)
        .attr('y', d => y(d.group) + y.bandwidth() + -3)
        .text((d) => {
          if (d.value_pct) return `${d.group} | ${(d.value_pct * 100).toFixed(1)} %`;
          return `${d.group}`;
        });

      groupLabels.exit().remove();

      const barLabels = svg.selectAll('.barlabel')
        .data(rawData, d => d.group);

      barLabels.enter().append('text')
        .attr('class', 'label barlabel')
        .attr('text-anchor', 'left')
        .attr('alignment-baseline', 'top');

      barLabels.transition().duration(300)
        .attr('x', d => x(d.value) + 6)
        .attr('y', d => y(d.group) + (y.bandwidth() / 2) + -2)
        .text(d => barLabel ? `${numeral(d.value).format('0,0')}` : '');

      barLabels.exit().remove();

      const bars = svg.selectAll('.buildingsbar')
        .data(rawData, d => d.group);

      bars.enter()
        .append('rect')
        .attr('class', 'buildingsbar')
        .attr('fill', (d) => {
          if (d.color) return d.color;
          return '#A8A8A8';
        })
        .attr('x', 0)
        .attr('height', y.bandwidth() - 14)
        .attr('rx', 2)
        .attr('ry', 2);

      bars.transition().duration(300)
        .attr('height', y.bandwidth() - 14)
        .attr('y', d => y(d.group))
        .attr('width', d => x(d.value));

      bars.exit().remove();
    });
  },
});

export default HorizontalBar;
