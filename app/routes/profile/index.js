import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('profile');
  },
  mapState: Ember.inject.service(),
  actions: {
    didTransition() {
      let profile = this.controller.get('model');
      let mapState = this.get('mapState');

      mapState.set('currentlySelected', profile.properties.borocd);
    }
  }
});
