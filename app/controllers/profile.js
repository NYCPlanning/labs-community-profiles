import Ember from 'ember';

export default Ember.Controller.extend({
  mapState: Ember.inject.service(),
  metrics: Ember.inject.service(),
  queryParams: ['section'],

  columns: [
    'poverty_rate',
    'unemployment_cd',
    'crime_per_1000',
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
  ],

  section: '',

  d: Ember.computed('model', function () {
    return this.get('model.dataprofile');
  }),
  actions: {
    handleAfterScroll(href, evt) {
      const metrics = this.get('metrics');

      this.set('section', href.replace('#', ''));
    },
  },
});
