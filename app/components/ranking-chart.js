import Ember from 'ember'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import numeral from 'numeral';
import d3 from 'd3';

export default Ember.Component.extend(ResizeAware, {
  classNames: ['ranking-chart'],

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

  height: 50,
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

    let bars = svg.append('g')
      .attr('class', 'bars');

    let moes = svg.append('g')
      .attr('class', 'moes');

    let masks = svg.append('g')
      .attr('class', 'masks');

    let div = d3.select(el.get(0))
      .append('div')
      .attr('class', 'tooltip')
      .attr('style', 'opacity: 1;');

    this.set('svg', svg);
    this.set('div', div);
    this.set('bars', bars);
    this.set('moes', moes);
    this.set('masks', masks);

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
      const moe = this.get('moe');
      const rank = data.findIndex(d => d.is_selected);
      const unit = this.get('unit');

      if(!data[0][column]) return;

      const { svg, div, bars, masks, moes } =
        this.getProperties('svg', 'div', 'bars', 'masks', 'moes');

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
        .domain([0, d3.max(data, d => (d[column] + (d[moe] || 0)))])
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

      const tooltipTemplate = function(d) {
        const selected = d || current;
        return `${selected.boro_district}: <strong>${percent(selected[column])}${unit}</strong><div>${moe ? `(± ${percent(selected[moe])}${unit})` : ''}</div>`;
      };

      const handleMouseOver = (d, i) => {
        const selector = `.bar-${d.borocd}`;
        svg.select(selector)
          .transition()
          .duration(10)
          .attr('fill', colorsHash.dcp_orange);

        div
          .html(function() {
            return tooltipTemplate(d);
          })
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
      const theseBars = bars
        .selectAll('.bar')
        .data(data, function (d) {
          return d.borocd;
        });

      const theseMoes = moes
        .selectAll('.bar')
        .data(data, function (d) {
          return d.borocd;
        });

      const theseMasks = masks
        .selectAll('.bar')
        .data(data, function (d) {
          return d.borocd;
        });

      // update elements
      theseBars
        .attr('fill', colors)
        .attr('width', () => x.bandwidth() - 2)
        .attr('x', d => x(d.borocd));

      theseMasks
        .attr('width', x.bandwidth())
        .attr('x', d => x(d.borocd))
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut);

      theseBars.enter()
        .append('rect')
        .attr('class', (d, i) => `bar bar-${d.borocd} bar-index-${i}`)
        .attr('fill', colors)
        .attr('y', d => height - y(d[column]))
        .attr('width', d => x.bandwidth() - 2)
        .attr('x', d => x(d.borocd))
        .attr('height', d => y(d[column]));

      theseMasks.enter()
        .append('rect')
        .attr('class', 'mask')
        .attr('opacity', 0)
        .attr('y', 0)
        .attr('width', x.bandwidth())
        .attr('x', d => x(d.borocd))
        .attr('height', height)
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut);

      if(moe) {
        theseMoes
          .attr('fill', '#6eceff')
          .attr('width', () => x.bandwidth() - 2)
          .attr('x', d => x(d.borocd));

        theseMoes.enter()
          .append('rect')
          .attr('class', (d, i) => `bar moe bar-${d.borocd} bar-index-${i}`)
          .style('opacity', '0.5')
          .attr('fill', '#6eceff')
          .attr('y', d => height - (y(d[column]) + y(d[moe])))
          .attr('width', d => x.bandwidth() - 2)
          .attr('x', d => x(d.borocd))
          .attr('height', d => y(d[moe]) * 2);
      }

      div
        .html(tooltipTemplate)
        .attr('style', function () {
          const midpoint = calculateMidpoint(this);
          return `left: ${x(current.borocd) - midpoint}px`;
        });

      svg
        .on('mouseout', function() {
          div
            .html(tooltipTemplate)
            .attr('style', function() {
              const midpoint = calculateMidpoint(this);
              return `left: ${x(current.borocd) - midpoint}px`;
            });
        });
    });
  },
});
