import Ember from 'ember'; // eslint-disable-line

export default Ember.Route.extend({
  mapState: Ember.inject.service(),

  actions: {
    didTransition() {
      const mapState = this.get('mapState');
      mapState.set('currentlySelected', null);
    },
  },
});
