import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('application');
  },
  actions: {
    transitionToProfile(route) {
      this.transitionTo('profile', route.boroname, route.borocd);
    }
  }
});
