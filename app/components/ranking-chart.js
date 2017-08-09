import Ember from 'ember'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import numeral from 'numeral';
import d3 from 'd3';

export default Ember.Component.extend(ResizeAware, {
  classNames: ['land-use-chart'],

  resizeWidthSensitive: true,
  resizeHeightSensitive: true,

  data: [],
  column: '',

  colors: {
    gray: '#a8a8a8',
    web_safe_orange: '#a24c0e',
    dcp_orange: '#de7d2c',
  },

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
        .attr('style', 'opacity: 0;');
    }

    div
      .attr('class', 'tooltip')
      .attr('style', 'opacity: 0;');

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
    const borocd = this.get('borocd');
    const colorsHash = this.get('colors');
    const data = this.get('data');
    const column = this.get('column');
    const rank = this.get('rank');

    Promise.all([data, rank]).then(resolve => {
      const [data, rank] = resolve;

      const x = d3.scaleBand()
        .domain(data.map(d => d.borocd))
        .range([0, width])
        .padding(0);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[column])])
        .range([0, height]);

      const colors = (d, i) => {
        return (i === rank) ? colorsHash.web_safe_orange : colorsHash.gray;
      };

      const isCurrentlySelected = (i) => {
        return rank === i;
      };

      const bars = svg.selectAll('.bar')
        .data(data);

      bars.enter()
        .append('rect')
        .attr('class', (d,i) => `bar bar-${d.borocd}`)
        .attr('fill', colors)
        .attr('y', d => height - y(d[column]))
        .attr('width', d => x.bandwidth() - 2)
        .attr('x', d => x(d.borocd))
        .attr('height', d => y(d[column]));

      bars.enter()
        .append('rect')
        .attr('class', 'mask')
        .attr('opacity', 0)
        .attr('y', 0)
        .attr('width', x.bandwidth())
        .attr('x', d => x(d.borocd))
        .attr('height', height)
        .on('mouseover', function(d, i) {
          const selector = `.bar-${d.borocd}`;
          d3.selectAll(selector)
            .transition()
            .duration(10)
            .attr('fill', colorsHash.dcp_orange);

          div
            // .transition()
            // .duration(10)
            .attr('style', 'opacity: 1;')
            .attr('style', () => `left: ${x(d.borocd)}px`)
            .text(() => `${d.boro_district}: ${numeral(d[column], '0.0')}%`);
        })
        .on('mouseout', function(d, i) {
          const selector = `.bar-${d.borocd}`;
          d3.selectAll(selector)
            .transition()
            .duration(10)
            .attr('fill', isCurrentlySelected(i) ? colorsHash.web_safe_orange : colorsHash.gray);
        });

      svg.on('mouseout', function() {
        div
          .attr('style', 'opacity: 0;');
      });

      bars.transition().duration(300)
        .attr('fill', colors);

      bars.exit().remove();
    });
  },
});
