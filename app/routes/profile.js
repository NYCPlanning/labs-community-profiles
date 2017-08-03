import Ember from 'ember';
import { L } from 'ember-leaflet';

import carto from '../utils/carto';

export default Ember.Route.extend({
  mapState: Ember.inject.service(),
  model(params) {
    const sql = `SELECT * FROM community_district_profiles WHERE borocd=${params.name}`;
    const endpoint = `https://cartoprod.capitalplanning.nyc/user/cpp/api/v2/sql?q=${sql}`;

    const selectedDistrict = this.modelFor('application')
      .features
      .find(district => district.properties.borocd === parseInt(params.name, 10));

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
