import Ember from 'ember';

export default Ember.Controller.extend({
  mapState: Ember.inject.service(),
  d: Ember.computed('model', function() {
    return this.get('model.properties.dataprofile');
  }),
});
