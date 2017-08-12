import Ember from 'ember'; // eslint-disable-line
import { L } from 'ember-leaflet'; // eslint-disable-line
import bbox from 'npm:@turf/bbox'; // eslint-disable-line

import carto from '../utils/carto';

function buildBorocd(boro, cd) {
  let borocode;
  switch (boro) {
    case 'manhattan':
      borocode = 100;
      break;
    case 'bronx':
      borocode = 200;
      break;
    case 'brooklyn':
      borocode = 300;
      break;
    case 'queens':
      borocode = 400;
      break;
    case 'staten-island':
      borocode = 500;
      break;
    default:
  }
  return borocode + parseInt(cd, 10);
}

export default Ember.Route.extend({
  mapState: Ember.inject.service(),
  model(params) {
    const { boro, cd } = params;
    const borocd = buildBorocd(boro, cd);
    const sql = `SELECT * FROM community_district_profiles WHERE borocd=${borocd}`;

    const selectedDistrict =
      this.modelFor('application').findBy('borocd', borocd);

    return carto.SQL(sql, 'json')
      .then((json) => {
        selectedDistrict.set('dataprofile', json[0]);
        return selectedDistrict;
      });
  },
  afterModel(district) {
    const mapState = this.get('mapState');
    
    mapState.set('bounds', district.get('bounds'));

    carto.getTileTemplate()
      .then((landUseTemplate) => {
        mapState.set('landUseTemplate', landUseTemplate);
      });
  },
  actions: {
    error(error) {
      console.log(error);
      this.transitionTo('/not-found');
    },
  },
});
