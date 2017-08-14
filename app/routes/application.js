import Ember from 'ember'; // eslint-disable-line
import toGeojson from '../utils/to-geojson';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('district');
  },

  setupController(controller, districts) {
    this._super(controller, districts);
    controller.set('geojson', toGeojson(districts));
  },

  actions: {
    transitionToProfile(district) {
      const { boro, borocd } = district.getProperties('boro', 'borocd');

      this.transitionTo('profile', boro.dasherize(), borocd % 100);
    },
  },
});
