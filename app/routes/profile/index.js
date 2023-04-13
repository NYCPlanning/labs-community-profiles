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
    const previouslySelectedBorocd = mapState.get('currentlySelected.borocd');
    const mapInstance = mapState.get('mapInstance');

    // seeing async issues - putting inside run loop to stagger
    next(this, () => {
      if (mapInstance) {
        if (previouslySelectedBorocd) {
          mapInstance.setFeatureState(
            { source: 'cds', id: previouslySelectedBorocd },
            { selected: false },
          );
        }

        mapInstance.setFeatureState(
          { source: 'cds', id: district.borocd },
          { selected: true },
        );
      }
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
