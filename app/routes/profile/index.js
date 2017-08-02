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

      // seeing async issues - putting inside run loop to stagger
      Ember.run.next(this, ()=> {
        mapState.set('currentlySelected', profile.properties.borocd);
      });
    }
  }
});
