import { computed } from '@ember/object'; // eslint-disable-line
import Component from '@ember/component';
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line

import { max } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import { select } from 'd3-selection';
import 'd3-transition';

import carto from '../utils/carto';
import landUseLookup from '../utils/land-use-lookup';

const LandUseChart = Component.extend(ResizeAware, {
  classNameBindings: ['loading'],
  classNames: ['land-use-chart'],

  resizeWidthSensitive: true,
  resizeHeightSensitive: true,
  loading: false,

  borocd: '',
  sql: computed('borocd', function sql() {
    const borocd = this.get('borocd');
    const SQL = `
    WITH lots AS (
      SELECT
        a.the_geom,
        CASE
          WHEN c.description IS NOT NULL THEN c.description
          ELSE 'Other'
        END as landuse_desc,
        c.code as landuse,
        lotarea
      FROM mappluto a
      LEFT JOIN support_landuse_lookup c
            ON a.landuse::integer = c.code
      WHERE a.cd = '${borocd}'
      AND a.address != 'BODY OF WATER'
    ),
    totalsf AS (
      SELECT sum(lotarea) as total
      FROM lots
    )
    SELECT
      count(landuse_desc),
      landuse,
      landuse_desc
    FROM lots, totalsf
    GROUP BY landuse, landuse_desc, totalsf.total
    `;

    return SQL;
  }),

  communityProfilesSql: computed('borocd', function sql() {
    const borocd = this.get('borocd');
    const SQL = `
    SELECT
      borocd,
      pct_lot_area_commercial_office,
      pct_lot_area_industrial_manufacturing,
      pct_lot_area_mixed_use,
      pct_lot_area_open_space,
      pct_lot_area_other_no_data,
      pct_lot_area_parking,
      pct_lot_area_public_facility_institution,
      pct_lot_area_res_1_2_family_bldg,
      pct_lot_area_res_multifamily_elevator,
      pct_lot_area_res_multifamily_walkup,
      pct_lot_area_transportation_utility,
      pct_lot_area_vacant
    FROM community_district_profiles_v202303
    WHERE borocd = '${borocd}'
    `;

    return SQL;
  }),

  data: computed('sql', 'borocd', function() {
    const sql = this.get('sql');
    return carto.SQL(sql);
  }),

  communityProfilesData: computed('communityProfilesSql', 'borocd', function() {
    const sql = this.get('communityProfilesSql');
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
      svg = select(el.get(0)).append('svg')
        .attr('class', 'chart');
    }

    this.set('svg', svg);
    this.updateChart();
  },

  updateChart: function updateChart() {
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

    data.then((rawData) => {
      this.get('communityProfilesData').then((communityProfilesData) => {
        // NAME of lot area percent field on community_district_profiles_v202303 dataset
        function landUsePercentField(plutoData) {
          return landUseLookup(plutoData.landuse).community_profiles_percent_field;
        }

        // VALUE of lot area percent field pulled from community_district_profiles_v202303 dataset
        function lotAreaPercent(plutoData) {
          const percentField = landUsePercentField(plutoData);
          const percentValue = communityProfilesData[0][percentField];
          return percentValue / 100;
        }

        // sort rawData by lot area percent field value
        rawData.sort(function(a, b) {
          return communityProfilesData[0][landUsePercentField(b)] - communityProfilesData[0][landUsePercentField(a)];
        });

        const y = scaleBand()
          .domain(rawData.map(d => d.landuse_desc))
          .range([0, height])
          .paddingOuter(0)
          .paddingInner(0.2);

        const x = scaleLinear()
          .domain([0, max(rawData, d => lotAreaPercent(d))])
          .range([0, width]);

        const bars = svg.selectAll('.bar')
          .data(rawData, d => d.landuse);

        bars.enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('fill', d => landUseLookup(d.landuse).color)
          .attr('x', 0)
          .attr('height', y.bandwidth() - 15)
          .attr('rx', 2)
          .attr('ry', 2)
          .attr('y', d => y(d.landuse_desc))
          .attr('width', d => x(lotAreaPercent(d)));


        bars.transition().duration(300)
          .attr('height', y.bandwidth() - 15)
          .attr('y', d => y(d.landuse_desc))
          .attr('width', d => x(lotAreaPercent(d)));

        bars.exit().remove();

        const labels = svg.selectAll('text')
          .data(rawData, d => d.landuse);

        labels.enter().append('text')
          .attr('class', 'label')
          .attr('text-anchor', 'left')
          .attr('alignment-baseline', 'top')
          .attr('x', 0)
          .attr('y', d => y(d.landuse_desc) + y.bandwidth() + -3)
          .text(d => `${d.landuse_desc} | ${(lotAreaPercent(d) * 100).toFixed(2)}%`);

        labels.transition().duration(300)
          .attr('y', d => y(d.landuse_desc) + y.bandwidth() + -3)
          .text(d => `${d.landuse_desc} | ${(lotAreaPercent(d) * 100).toFixed(2)}%`);

        labels.exit().remove();
      });
    });
  },
});

export default LandUseChart;
