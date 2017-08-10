import Ember from 'ember';
import bbox from 'npm:@turf/bbox'; // eslint-disable-line

export default Ember.Route.extend({
  mapState: Ember.inject.service(),

  model() {
    return this.modelFor('application');
  },

  afterModel(districts) {
    const mapState = this.get('mapState');
    mapState.set('bounds', bbox(districts));
  },

  actions: {
    didTransition() {
      let mapState = this.get('mapState');
      let mapInstance = mapState.get('mapInstance');

      mapState.set('currentlySelected', null);
    }
  }
});
