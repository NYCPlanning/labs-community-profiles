import Ember from 'ember'; // eslint-disable-line
import { L } from 'ember-leaflet'; // eslint-disable-line

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
    const endpoint = `https://cartoprod.capitalplanning.nyc/user/cpp/api/v2/sql?q=${sql}`;

    const selectedDistrict = this.modelFor('application')
      .features.find(district => district.properties.borocd === borocd);

    return fetch(endpoint)
      .then(response => response.json())
      .then((json) => {
        const dataprofile = Ember.get(json, 'rows')[0];
        Ember.set(selectedDistrict, 'properties.dataprofile', dataprofile);
        return selectedDistrict;
      });
  },
  afterModel(profile) {
    const mapState = this.get('mapState');
    mapState.set('bounds', L.geoJson(profile.geometry).getBounds());
    mapState.set('geom', profile.geometry);

    carto.getTileTemplate()
      .then((landUseTemplate) => {
        mapState.set('landUseTemplate', landUseTemplate);
      });
  },
});
