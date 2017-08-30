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
        building_typology,
        SUM(numbldgs) as numbldgs,
        SUM(unitsres) as unitsres,
        ROUND(SUM(numbldgs)::numeric / totalbuildings, 4) AS numbldgs_pct,
        ROUND(SUM(unitsres)::numeric / totalunitsres, 4) AS unitsres_pct
      FROM (
        SELECT
          numbldgs,
          unitsres,
        CASE
          WHEN (unitsres < 3 AND unitsres > 0) AND (proxcode = '0' OR proxcode = '1') THEN '1-2 family detached'
          WHEN (unitsres < 3 AND unitsres > 0) AND (proxcode = '2' OR proxcode = '3') THEN '1-2 family attached/semi-detached'
          WHEN (unitsres < 6 AND unitsres > 2) AND (numfloors < 5) AND (comarea = 0 AND officearea = 0 AND retailarea = 0 AND factryarea = 0) THEN 'Small Apartment Buildings'
          WHEN (unitsres < 6 AND unitsres > 2) AND (comarea > 0 OR officearea > 0 OR retailarea > 0 OR factryarea > 0) THEN 'Small mixed-use buildings'
          WHEN (unitsres = 0 AND numfloors < 5) AND (comarea > 0 OR officearea > 0 OR retailarea > 0) AND factryarea = 0 THEN 'Commercial-only buildings'
          WHEN (unitsres = 0 AND numfloors < 5) AND factryarea > 0 THEN 'Manufacturing buildings'
          WHEN (unitsres >= 6 AND numfloors > 4) AND (comarea = 0 AND officearea = 0 AND retailarea = 0 AND factryarea = 0) THEN 'Big apartment buildings'
          WHEN (UnitsRes >= 6 AND NumFloors > 4) AND (ComArea > 0 OR OfficeArea > 0 OR RetailArea > 0) AND FactryArea = 0 THEN 'Big mixed-use buildings'
          ELSE 'Other Building Types'
        END AS building_typology,
        SUM (numbldgs) OVER () as totalbuildings,
        SUM (unitsres) OVER () as totalunitsres
        FROM support_mappluto a
        INNER JOIN support_admin_cdboundaries b
        ON ST_Contains(b.the_geom, a.the_geom)
        AND b.borocd = '${borocd}'
        INNER JOIN support_waterfront_pfirm15 c
        ON ST_Intersects(a.the_geom, c.the_geom)
        AND (fld_zone = 'AE' OR fld_zone = 'VE')
      ) x
      GROUP BY building_typology, totalbuildings, totalunitsres
      ORDER BY unitsres DESC
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
        .domain(rawData.map(d => d.building_typology))
        .range([0, height])
        .paddingOuter(0)
        .paddingInner(0.1);

      const x = d3.scaleLinear()
        .domain([0, d3.max(rawData, d => d[property])])
        .range([0, width]);

      const typeLabels = svg.selectAll('.typelabel')
        .data(rawData, d => d.building_typology);

      typeLabels.enter().append('text')
        .attr('class', 'label typelabel')
        .attr('text-anchor', 'left')
        .attr('alignment-baseline', 'top')
        .attr('x', 0);

      typeLabels.transition().duration(300)
        .attr('y', d => y(d.building_typology) + y.bandwidth() + -3)
        .text(d => `${d.building_typology} | ${(d[`${property}_pct`] * 100).toFixed(1)} %`);

      typeLabels.exit().remove();

      const barLabels = svg.selectAll('.barlabel')
        .data(rawData, d => d.building_typology);

      barLabels.enter().append('text')
        .attr('class', 'label barlabel')
        .attr('text-anchor', 'left')
        .attr('alignment-baseline', 'top');

      barLabels.transition().duration(300)
        .attr('x', d => x(d[property]) + 6)
        .attr('y', d => y(d.building_typology) + (y.bandwidth() / 2) + -2)
        .text(d => `${d[property]}`);

      barLabels.exit().remove();

      const buildingsbars = svg.selectAll('.buildingsbar')
        .data(rawData, d => d.building_typology);

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
        .attr('y', d => y(d.building_typology))
        .attr('width', d => x(d[property]));

      buildingsbars.exit().remove();
    });
  },
});

export default LandUseChart;
