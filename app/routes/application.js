import Ember from 'ember'; // eslint-disable-line

export default Ember.Route.extend({
  model() {
    return this.store.findAll('district');
  },

  actions: {
    transitionToProfile(boro) {
      this.transitionTo('profile', boro.boro.dasherize(), boro.borocd % 100);
    },
  },
});
