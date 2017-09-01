import Ember from 'ember';
import SetMapBounds from '../mixins/set-map-bounds';
import ScrollToTop from '../mixins/scroll-to-top';

export default Ember.Route.extend(ScrollToTop, SetMapBounds, {
  model() {
    return this.modelFor('application');
  },
});
