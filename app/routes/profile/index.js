import Ember from 'ember'; // eslint-disable-line

export default Ember.Route.extend({
  mapState: Ember.inject.service(),
  scroller: Ember.inject.service(),
  model() {
    return this.modelFor('profile');
  },
  afterModel(district) {
    const mapState = this.get('mapState');

    // seeing async issues - putting inside run loop to stagger
    Ember.run.next(this, () => {
      mapState.set('currentlySelected', district);
    });
  },

  actions: {
    didTransition() {
      const scroller = this.get('scroller');
      const section = this.paramsFor('profile').section;
      if (section) {
        Ember.run.next(this, () => {
          scroller.scrollVertical(`#${section}`, {
            // offset: -210,
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
