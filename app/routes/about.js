import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import SetMapBounds from '../mixins/set-map-bounds';
import ScrollToTop from '../mixins/scroll-to-top';

export default Route.extend(ScrollToTop, SetMapBounds, {
  scroller: service(),
  model() {
    return this.modelFor('application');
  },
  actions: {
    didTransition() {
      const scroller = this.get('scroller');
      const { section } = this.paramsFor('about');

      if (section) {
        next(this, () => {
          scroller.scrollVertical(`#${section}`, {
            // offset: -115,
          });
        });
      }
    },
  },
});
