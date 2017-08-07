import Ember from 'ember';
import { L } from 'ember-leaflet';

export default Ember.Route.extend({
  mapState: Ember.inject.service(),

  model() {
    return this.modelFor('application');
  },

  afterModel(districts) {
    let mapState = this.get('mapState');
    mapState.set('bounds', L.geoJson(districts).getBounds());
  },

  actions: {
    didTransition() {
      let mapState = this.get('mapState');
      let mapInstance = mapState.get('mapInstance');

      mapState.set('currentlySelected', null);
    }
  }
});
