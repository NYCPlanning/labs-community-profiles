import Ember from 'ember'; // eslint-disable-line
import toGeojson from '../utils/to-geojson';

export default Ember.Route.extend({
  metrics: Ember.inject.service(),
  model() {
    return this.store.findAll('district');
  },

  setupController(controller, districts) {
    this._super(controller, districts);
    controller.set('geojson', toGeojson(districts));
  },

  actions: {
    transitionToProfile(boro) {
      const metrics = this.get('metrics');

      metrics.trackEvent({
        eventCategory: 'Navigation Map',
        eventAction: 'Click',
        eventLabel: `${boro} ${cd}`,
        eventValue: borocd,
      });
      
      this.transitionTo('profile', boro.boro.dasherize(), boro.borocd % 100);
    },
  },
});
