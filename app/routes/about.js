import Ember from 'ember';
import SetMapBounds from '../mixins/set-map-bounds';

export default Ember.Route.extend(SetMapBounds, {
  model() {
    return this.modelFor('application');
  },
});
