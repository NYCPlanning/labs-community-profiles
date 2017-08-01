import Ember from 'ember';
import { L } from 'ember-leaflet';

export default Ember.Route.extend({
  mapState: Ember.inject.service(),
  model(params) {
    return this.modelFor('application')
      .features.find(district=>district.properties.borocd === parseInt(params.name));
  },
  afterModel(profile) {
    let mapState = this.get('mapState');
    mapState.set('bounds', L.geoJson(profile.geometry).getBounds());
  }
});
