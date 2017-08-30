import Ember from 'ember'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line

import carto from '../utils/carto';

const LandUseChart = Ember.Component.extend(ResizeAware, {
  classNameBindings: ['loading'],
  classNames: ['land-use-chart'],

  resizeWidthSensitive: true,
  resizeHeightSensitive: true,
  loading: false,
  property: '',
  borocd: '',
  sql: Ember.computed('borocd', function sql() {
    const borocd = this.get('borocd');
    const SQL = `
    SELECT
      count(building_age), building_age,
      ROUND(count(building_age)::numeric / totalbuildings, 4) AS building_age_pct
    FROM (
      SELECT
      CASE
        WHEN yearbuilt > 0 AND yearbuilt < 1961  THEN 'Pre-1961'
        WHEN yearbuilt >= 1961 AND YearBuilt < 1983 THEN '1961-1982'
        WHEN yearbuilt >= 1983 AND YearBuilt < 2013 THEN '1983-2012'
        WHEN yearbuilt >= 2013 THEN '2013-Present'
        ELSE 'Unknown'
      END AS building_age,
      SUM (numbldgs) OVER () as totalbuildings
      FROM support_mappluto a
      INNER JOIN support_admin_cdboundaries b
      ON ST_Contains(b.the_geom, a.the_geom)
      AND b.borocd = '${borocd}'
      INNER JOIN support_waterfront_pfirm15 c
      ON ST_Intersects(a.the_geom, c.the_geom)
      AND (fld_zone = 'AE' OR fld_zone = 'VE')
    ) x
    GROUP BY building_age, totalbuildings
    ORDER BY array_position(array['Pre-1961','1961-1982','1983-2012','2013-Present','Unknown'], building_age)
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
    const property = this.get('property');

    const el = this.$();
    const elWidth = el.width();

    const margin = {
      top: 0,
      right: 50,
      bottom: 0,
      left: 0,
    };
    const height = 400 - margin.top - margin.bottom;
    const width = elWidth - margin.left - margin.right;

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    data.then((rawData) => {
      rawData.sort(function(a, b) {
        return a[property] < b[property];
      });

      const y = d3.scaleBand()
        .domain(rawData.map(d => d.building_age))
        .range([0, height])
        .paddingOuter(0)
        .paddingInner(0.1);

      const x = d3.scaleLinear()
        .domain([0, d3.max(rawData, d => d.count)])
        .range([0, width]);

      const typeLabels = svg.selectAll('.typelabel')
        .data(rawData, d => d.building_age);

      typeLabels.enter().append('text')
        .attr('class', 'label typelabel')
        .attr('text-anchor', 'left')
        .attr('alignment-baseline', 'top')
        .attr('x', 0);

      typeLabels.transition().duration(300)
        .attr('y', d => y(d.building_age) + y.bandwidth() + -3)
        .text(d => `${d.building_age} | ${(d.building_age_pct * 100).toFixed(1)} %`);

      typeLabels.exit().remove();

      const barLabels = svg.selectAll('.barlabel')
        .data(rawData, d => d.building_age);

      barLabels.enter().append('text')
        .attr('class', 'label barlabel')
        .attr('text-anchor', 'left')
        .attr('alignment-baseline', 'top');

      barLabels.transition().duration(300)
        .attr('x', d => x(d.count) + 6)
        .attr('y', d => y(d.building_age) + (y.bandwidth() / 2) + -2)
        .text(d => `${d.count}`);

      barLabels.exit().remove();

      const buildingsbars = svg.selectAll('.buildingsbar')
        .data(rawData, d => d.building_age);

      buildingsbars.enter()
        .append('rect')
        .attr('class', 'buildingsbar')
        .attr('fill', '#A8A8A8')
        .attr('x', 0)
        .attr('height', y.bandwidth() - 14)
        .attr('rx', 2)
        .attr('ry', 2);

      buildingsbars.transition().duration(300)
        .attr('height', y.bandwidth() - 14)
        .attr('y', d => y(d.building_age))
        .attr('width', d => x(d.count));

      buildingsbars.exit().remove();
    });
  },
});

export default LandUseChart;
