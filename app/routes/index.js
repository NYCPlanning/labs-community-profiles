import { inject as service } from '@ember/service'; // eslint-disable-line
import Route from '@ember/routing/route';
import toGeojson from '../utils/to-geojson';
import bbox from '@turf/bbox'; // eslint-disable-line
import ScrollToTop from '../mixins/scroll-to-top';

export default Route.extend(ScrollToTop, {
  mapState: service(),

  model() {
    return this.modelFor('application');
  },

  afterModel(districts) {
    const mapState = this.get('mapState');
    const geojsonDistricts = toGeojson(districts);
    mapState.set('bounds', bbox(geojsonDistricts));
  },

  actions: {
    didTransition() {
      const mapState = this.get('mapState');
      mapState.set('currentlySelected', null);
    },
  },
});
