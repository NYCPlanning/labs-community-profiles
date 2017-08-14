import Ember from 'ember'; // eslint-disable-line
import bbox from 'npm:@turf/bbox'; // eslint-disable-line
import toGeojson from '../utils/to-geojson';

export default Ember.Route.extend({
  mapState: Ember.inject.service(),

  model() {
    return this.store.findAll('district');
  },

  afterModel(districts) {
    const mapState = this.get('mapState');
    const geojsonDistricts = toGeojson(districts);
    mapState.set('bounds', bbox(geojsonDistricts));
  },


  setupController(controller, districts) {
    this._super(controller, districts);
    controller.set('geojson', toGeojson(districts));
  },

  actions: {
    transitionToProfile(boro) {
      this.transitionTo('profile', boro.boro.dasherize(), boro.borocd % 100);
    },
  },
});
