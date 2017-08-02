import Ember from 'ember';
import { L } from 'ember-leaflet';

import carto from '../utils/carto';

export default Ember.Route.extend({
  mapState: Ember.inject.service(),
  model(params) {
    return this.modelFor('application')
      .features.find(district=>district.properties.borocd === parseInt(params.name));
  },
  afterModel(profile) {
    let mapState = this.get('mapState');
    mapState.set('bounds', L.geoJson(profile.geometry).getBounds());
    mapState.set('geom', profile.geometry);

    carto.getTileTemplate()
      .then(landUseTemplate => {
        mapState.set('landUseTemplate', landUseTemplate);
      })
  }
});
