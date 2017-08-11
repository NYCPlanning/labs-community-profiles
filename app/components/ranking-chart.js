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
  rank: 0,
  ranked: null,

  colors: {
    gray: '#a8a8a8',
    web_safe_orange: '#a24c0e',
    dcp_orange: '#de7d2c',
  },

  height: 100,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  didInsertElement() {
    const el = this.$();
    const elWidth = el.width();
    const margin = this.get('margin');
    const height = this.get('height') - margin.top - margin.bottom;
    const width = elWidth - margin.left - margin.right;

    let svg = d3.select(el.get(0))
      .append('svg')
      .attr('class', 'chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    let div = d3.select(el.get(0))
      .append('div')
      .attr('class', 'tooltip')
      .attr('style', 'opacity: 1;');

    this.set('svg', svg);
    this.set('div', div);

    this._super(...arguments);
  },

  debouncedDidResize(width, height, evt) {
    this.didRender();
  },

  didRender() {
    const el = this.$();
    const elWidth = el.width();
    const dataPromise = this.get('data');

    Promise.resolve(dataPromise).then((data) => {
      const margin = this.get('margin');
      const height = this.get('height') - margin.top - margin.bottom;
      const width = elWidth - margin.left - margin.right;
      const colorsHash = this.get('colors');
      const column = this.get('column');
      const rank = data.findIndex(d => d.is_selected);
      const unit = this.get('unit');

      const { svg, div } =
        this.getProperties('svg', 'div');

      div
        .attr('class', 'tooltip');

      svg
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

      const x = d3.scaleBand()
        .domain(data.map(d => d.borocd))
        .range([0, width])
        .padding(0);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[column])])
        .range([0, height]);

      const colors = (d) => {
        return d.is_selected ? colorsHash.web_safe_orange : colorsHash.gray;
      };

      const calculateMidpoint = (node) => {
        return (node.getBoundingClientRect().width / 2) - Math.floor((x.bandwidth() / 2));
      };

      const percent = (number) => {
        return numeral(number).format('0.0');
      };

      const handleMouseOver = (d, i) => {
        const selector = `.bar-${d.borocd}`;
        svg.select(selector)
          .transition()
          .duration(10)
          .attr('fill', colorsHash.dcp_orange);

        div
          .text(() => `${d.boro_district}: ${percent(d[column])}${unit}`)
          .attr('style', function() {
            const midpoint = calculateMidpoint(this);
            return `left: ${x(d.borocd) - midpoint}px`;
          });
      };

      const handleMouseOut = (d, i) => {
        const selector = `.bar-${d.borocd}`;
        svg.select(selector)
          .transition()
          .duration(10)
          .attr('fill', function (d) {
            return d.is_selected ? colorsHash.web_safe_orange : colorsHash.gray;
          });
      };

      const current = data[rank];

      // Join new data
      const bars = svg.selectAll('.bar')
        .data(data, function (d) {
          return d.borocd;
        });

      // update elements
      bars
        .attr('fill', colors)
        .attr('width', () => x.bandwidth() - 2)
        .attr('x', d => x(d.borocd));

      bars.enter()
        .append('rect')
        .attr('class', (d,i) => `bar bar-${d.borocd} bar-index-${i}`)
        .attr('fill', colors)
        .attr('y', d => height - y(d[column]))
        .attr('width', d => x.bandwidth() - 2)
        .attr('x', d => x(d.borocd))
        .attr('height', d => y(d[column]))

      bars.enter()
        .append('rect')
        .attr('class', 'mask')
        .attr('opacity', 0)
        .attr('y', 0)
        .attr('width', x.bandwidth())
        .attr('x', d => x(d.borocd))
        .attr('height', height)
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut);

      div
        .text(() => `${current.boro_district}: ${percent(current[column])}${unit}`)
        .attr('style', function () {
          const midpoint = calculateMidpoint(this);
          return `left: ${x(current.borocd) - midpoint}px`;
        });

      svg
        .on('mouseout', function() {
          div
            .text(() => `${current.boro_district}: ${percent(current[column])}${unit}`)
            .attr('style', function() {
              const midpoint = calculateMidpoint(this);
              return `left: ${x(current.borocd) - midpoint}px`;
            });
        });
    });
  },
});
