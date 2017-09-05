import Ember from 'ember';
import SetMapBounds from '../mixins/set-map-bounds';
import ScrollToTop from '../mixins/scroll-to-top';

export default Ember.Route.extend(ScrollToTop, SetMapBounds, {
  scroller: Ember.inject.service(),
  model() {
    return this.modelFor('application');
  },
  actions: {
    didTransition() {
      const scroller = this.get('scroller');
      const section = this.paramsFor('about').section;
      console.log(this.paramsFor('about'));
      if (section) {
        Ember.run.next(this, () => {
          scroller.scrollVertical(`#${section}`, {
            offset: -210,
          });
        });
      }
    },
  },
});
