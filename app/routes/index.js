import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('application');
  },
  actions: {
    transitionToProfile(boro) {
      this.transitionTo('profile', boro.boro, boro.cd);
    }
  }
});
