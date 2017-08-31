import Ember from 'ember'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import { Promise } from 'rsvp';

import carto from '../utils/carto';

const colors = function(zonedist) {
  if (zonedist === 'R') return '#F3F88F';
  if (zonedist === 'M') return '#F8B7FB';
  if (zonedist === 'C') return '#FF8E8E';
  if (zonedist === 'P') return '#B5E6B9';
  return '#BCBCBB';
};

const descriptions = function(zonedist) {
  if (zonedist === 'R') return 'Resdiential';
  if (zonedist === 'M') return 'Manufacturing';
  if (zonedist === 'C') return 'Commercial';
  if (zonedist === 'P') return 'Park';
  if (zonedist === 'B') return 'Battery Park City';
  return 'Other Zones';
};

const LandUseChart = Ember.Component.extend(ResizeAware, {
  classNameBindings: ['loading'],
  classNames: ['land-use-chart'],

  resizeWidthSensitive: true,
  resizeHeightSensitive: true,
  loading: false,

  borocd: '',
  sql: Ember.computed('borocd', function sql() {
    const borocd = this.get('borocd');
    const SQL = `
      WITH zones as (
        SELECT ST_Intersection(ST_MakeValid(a.the_geom), ST_MakeValid(b.the_geom)) as the_geom, zonedist
        FROM support_zoning_zd a, support_admin_cdboundaries b
        WHERE ST_intersects(ST_MakeValid(a.the_geom), ST_MakeValid(b.the_geom))
        AND b.borocd = '${borocd}'
      ),
      totalsm AS (
        SELECT sum(ST_Area(the_geom::geography)) as total
        FROM zones
      )

    SELECT sum(percent) as percent, zonedist FROM (
        SELECT  ROUND((sum(ST_Area(the_geom::geography))/totalsm.total)::numeric,4) as percent, LEFT(zonedist, 1) as zonedist
      FROM zones, totalsm
      GROUP BY zonedist, totalsm.total
      ORDER BY percent DESC
    ) x
    GROUP BY zonedist
  `;

    return SQL;
  }),

  data: Ember.computed('sql', 'borocd', function() {
    const sql = this.get('sql');
    return carto.SQL(sql);
  }),

  didRender() {
    this.createChart();
  },

  debouncedDidResize(width) {
    this.set('width', width);
    this.updateChart();
  },

  createChart() {
    let svg = this.get('svg');

    if (!svg) {
      const el = this.$();
      svg = d3.select(el.get(0)).append('svg')
        .attr('class', 'chart');
    }

    this.set('svg', svg);
    this.updateChart();
  },

  updateChart() {
    const svg = this.get('svg');
    const data = this.get('data');

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

    if (data) {
      const y = d3.scaleBand()
        .domain(data.map(d => d.zonedist))
        .range([0, height])
        .paddingOuter(0)
        .paddingInner(0.2);

      const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.percent)])
        .range([0, width]);


      const bars = svg.selectAll('.bar')
        .data(data, d => d.zonedist);

      bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('fill', d => colors(d.zonedist))
        .attr('x', 0)
        .attr('height', y.bandwidth() - 15)
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('y', d => y(d.zonedist))
        .attr('width', d => x(d.percent));


      bars.transition().duration(300)
        .attr('height', y.bandwidth() - 15)
        .attr('y', d => y(d.zonedist))
        .attr('width', d => x(d.percent));

      bars.exit().remove();

      const labels = svg.selectAll('text')
        .data(data, d => d.zonedist);

      labels.enter().append('text')
        .attr('class', 'label')
        .attr('text-anchor', 'left')
        .attr('alignment-baseline', 'top')
        .attr('x', 0)
        .attr('y', d => y(d.zonedist) + y.bandwidth() + -3)
        .text((d) => {
          const description = descriptions(d.zonedist);
          return `${description} | ${(d.percent * 100).toFixed(2)}%`
        });

      labels.transition().duration(300)
        .attr('y', d => y(d.zonedist) + y.bandwidth() + -3)
        .text((d) => {
          const description = descriptions(d.zonedist);
          return `${description} | ${(d.percent * 100).toFixed(2)}%`
        });

      labels.exit().remove();
    };
  },
});

export default LandUseChart;
