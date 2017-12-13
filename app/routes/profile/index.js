import { next } from '@ember/runloop'; // eslint-disable-line
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  mapState: service(),
  scroller: service(),

  model() {
    return this.modelFor('profile');
  },
  afterModel(district) {
    const mapState = this.get('mapState');

    // seeing async issues - putting inside run loop to stagger
    next(this, () => {
      mapState.set('currentlySelected', district);
    });
  },

  actions: {
    didTransition() {
      const scroller = this.get('scroller');
      const section = window.location.hash.substr(1);

      if (section) {
        next(this, () => {
          scroller.scrollVertical(`#${section}`, {
          });
        });
      }
    },
    willTransition() {
      this.controllerFor('profile').set('section', '');
    },
    error() {
      return true;
    },
  },
});
