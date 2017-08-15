import Ember from 'ember'; // eslint-disable-line
import toGeojson from '../utils/to-geojson';
import trackPage from '../mixins/track-page';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('district');
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
}, trackPage);
