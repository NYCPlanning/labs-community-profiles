import Ember from 'ember';
import bbox from 'npm:@turf/bbox'; // eslint-disable-line
import toGeojson from '../utils/to-geojson';

export default Ember.Mixin.create({
  mapState: Ember.inject.service(),

  afterModel(districts) {
    this._super(...arguments);
    const mapState = this.get('mapState');
    const geojsonDistricts = toGeojson(districts);
    mapState.set('bounds', bbox(geojsonDistricts));
  },
});
