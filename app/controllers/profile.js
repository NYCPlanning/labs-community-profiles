import Ember from 'ember'; // eslint-disable-line

export default Ember.Controller.extend({
  mapState: Ember.inject.service(),
  metrics: Ember.inject.service(),
  queryParams: ['section'],
  noSON: Ember.computed('model', function () {
    const d = this.get('model.dataprofile');
    return d.son_issue_1.length === 0 && d.son_issue_2.length === 0 && d.son_issue_3.length === 0;
  }),
  racialProfile: Ember.computed('model', function() {
    const d = this.get('d');
    const profile = [
      { value_pct: d.pct_white_nh / 100, value: d.pct_white_nh, color: '#1f4064', group: 'White (Non-Hispanic)' },
      { value_pct: d.pct_black_nh / 100, value: d.pct_black_nh, color: '#fdc010', group: 'Black (Non-Hispanic)' },
      { value_pct: d.pct_asian_nh / 100, value: d.pct_asian_nh, color: '#cd594a', group: 'Asian (Non-Hispanic)' },
      { value_pct: d.pct_other_nh / 100, value: d.pct_other_nh, color: '#73c4e1', group: 'Other Race (Non-Hispanic)' },
      { value_pct: d.pct_hispanic / 100, value: d.pct_hispanic, color: '#5e170e', group: 'Hispanic (of any race)' }];
    return profile;
  }),
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
  ],

  section: '',

  d: Ember.computed('model', function () {
    return this.get('model.dataprofile');
  }),
  actions: {
    handleAfterScroll(href) {
      this.set('section', href.replace('#', ''));
    },
  },
});
