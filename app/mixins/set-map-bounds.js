import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import bbox from 'npm:@turf/bbox'; // eslint-disable-line
import toGeojson from '../utils/to-geojson';

export default Mixin.create({
  mapState: service(),

  afterModel(districts) {
    this._super(...arguments); // eslint-disable-line
    const mapState = this.get('mapState');
    const geojsonDistricts = toGeojson(districts);
    mapState.set('bounds', bbox(geojsonDistricts));
  },
});
