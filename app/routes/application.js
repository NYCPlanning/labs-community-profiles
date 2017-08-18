import Ember from 'ember'; // eslint-disable-line
import bbox from 'npm:@turf/bbox'; // eslint-disable-line
import toGeojson from '../utils/to-geojson';

export default Ember.Route.extend({
  metrics: Ember.inject.service(),
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
    transitionToProfile(district) {
      const { boro, borocd } = district.getProperties('boro', 'borocd');
      const metrics = this.get('metrics');

      metrics.trackEvent({
        eventCategory: 'Navigation Dropdown',
        eventAction: 'Click',
        eventLabel: `${boro} ${borocd % 100}`,
        eventValue: borocd,
      });

      const modelName = district.get('constructor.modelName');
      const mapState = this.get('mapState');

      if(modelName === 'address') {
        mapState.set('currentAddress', district);
      }

      this.transitionTo('profile', boro.dasherize(), borocd % 100);
    },
  },
});
