import { inject as service } from '@ember/service'; // eslint-disable-line
import Route from '@ember/routing/route';
import bbox from '@turf/bbox'; // eslint-disable-line
import toGeojson from '../utils/to-geojson';
import SetMapBounds from '../mixins/set-map-bounds';

export default Route.extend(SetMapBounds, {
  metrics: service(),
  mapState: service(),
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
      const metrics = this.get('metrics');

      metrics.trackEvent({
        eventCategory: 'Navigation Dropdown',
        eventAction: 'Click',
        eventLabel: `${boro} ${borocd % 100}`,
        eventValue: borocd,
        category: 'Navigation Dropdown',
        action: 'Click',
        name: `${boro} ${borocd % 100}`,
        value: borocd,
      });

      const modelName = district.get('constructor.modelName');
      const mapState = this.get('mapState');

      if (modelName === 'address') {
        mapState.set('currentAddress', district);
      }

      this.transitionTo('profile', boro.dasherize(), borocd % 100);
    },
  },
});
