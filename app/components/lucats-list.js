import Ember from 'ember'; // eslint-disable-line

export default Ember.Component.extend({
  district: null,
  projects: Ember.computed('district', function() {
    const boro = this.get('district.boro').toLowerCase();
    const cd = this.get('district.cd');
    const URL = `https://lucats.planninglabs.nyc/cdprojects/${boro}/${cd}`;

    return fetch(URL)
      .then(d => d.json());
  }),
});
