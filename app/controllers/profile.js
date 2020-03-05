import { next } from '@ember/runloop'; // eslint-disable-line
import computed from 'ember-computed-decorators';
import { inject as service } from '@ember/service'; // eslint-disable-line
import Controller from '@ember/controller'; // eslint-disable-line
import { range } from 'd3-array';

export default Controller.extend({
  mapState: service(),
  scroller: service(),
  metrics: service(),
  queryParams: ['section'],

  @computed('model')
  noSON() {
    const d = this.get('model.dataprofile');
    return d.son_issue_1.length === 0 && d.son_issue_2.length === 0 && d.son_issue_3.length === 0;
  },

  @computed('model')
  racialProfile() {
    const d = this.get('d');
    const profile = [
      { value_pct: d.pct_white_nh / 100, value: d.pct_white_nh, group: 'White (Non-Hispanic)' },
      { value_pct: d.pct_black_nh / 100, value: d.pct_black_nh, group: 'Black (Non-Hispanic)' },
      { value_pct: d.pct_asian_nh / 100, value: d.pct_asian_nh, group: 'Asian (Non-Hispanic)' },
      { value_pct: d.pct_other_nh / 100, value: d.pct_other_nh, group: 'Other Race (Non-Hispanic)' },
      { value_pct: d.pct_hispanic / 100, value: d.pct_hispanic, group: 'Hispanic (of any race)' }];
    return profile;
  },

  @computed('model')
  inFloodplain(model) {
    const { fp_100_bldg, fp_500_bldg } = model.dataprofile; // eslint-disable-line
    return fp_100_bldg !== 0 || fp_500_bldg !== 0; // eslint-disable-line
  },

  @computed('model')
  popDensity() {
    const d = this.get('d');
    const { pop_2010, area_sqmi } = d; // eslint-disable-line

    return pop_2010 / area_sqmi; // eslint-disable-line
  },

  @computed('model')
  agePopDist() {
    const d = this.get('d');
    const groups = range(4, 85, 5).reduce(
      (newArr, curr, i, arr) => {
        if (i + 1 <= arr.length - 1) newArr.push(`${curr + 1}_${arr[i + 1]}`);
        return newArr;
      },
      [],
    );

    groups.push('85_over');
    groups.unshift('under_5');

    return groups.map(group => ({
      group, male: d[`male_${group}`], female: d[`female_${group}`],
    }));
  },

  columns: [
    'poverty_rate',
    'unemployment_cd',
    'crime_count',
    'mean_commute',
    'pct_hh_rent_burd',
    'pct_clean_strts',
    'pct_bach_deg',
    'pct_served_parks',
    'moe_poverty_rate',
    'moe_bach_deg',
    'moe_unemployment_cd',
    'moe_mean_commute',
    'moe_hh_rent_burd',
    'lep_rate',
    'moe_lep_rate',
    'under18_rate',
    'over65_rate',
    'moe_under18_rate',
    'moe_over65_rate',
  ],

  @computed('model')
  dataprofileColumns() {
    return Object.keys(this.get('model.dataprofile'));
  },

  @computed('dataprofileColumns')
  dataprofileDownload() {
    const columns = this.get('dataprofileColumns').join(',');
    const model = this.get('model');

    return `https://planninglabs.carto.com/api/v2/sql?format=csv&q=SELECT ${columns} FROM community_district_profiles&filename=community-profiles-indicators.csv`;
  },

  @computed('dataprofileColumns')
  dataprofileDownloadGeoJSON() {
    const columns = this.get('dataprofileColumns')
      .filter(col => col !== 'the_geom') // prefer the spatial data
      .map(col => `c.${col}`)
      .join(',');
    const model = this.get('model');

    return `https://planninglabs.carto.com/api/v2/sql?format=geojson&q=SELECT 
      ${columns}, community_districts.the_geom
      FROM community_district_profiles c
      INNER JOIN community_districts
      ON community_districts.borocd = c.borocd
    &filename=community-profiles-indicators.json`;
  },

  section: '',

  @computed('model')
  d() {
    return this.get('model.dataprofile');
  },

  actions: {
    handleAfterScroll(target) {
      const scroller = this.get('scroller');
      this.set('section', target);
      next(this, () => {
        scroller.scrollVertical(`#${target}`, {
          // offset: -210,
        });
      });
    },
  },
});
