import Ember from 'ember';

export default Ember.Controller.extend({
  mapState: Ember.inject.service(),

  columns: [
    'poverty_rate',
    'unemployment_cd',
    'crime_per_1000',
    'mean_commute',
    'pct_hh_rent_burd',
    'pct_clean_strts',
    'pct_bach_deg'],

  d: Ember.computed('model', function() {
    return this.get('model.properties.dataprofile');
  }),
});
