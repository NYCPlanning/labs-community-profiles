import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('profile');
  },
  mapState: Ember.inject.service(),
  scroller: Ember.inject.service(),
  actions: {
    didTransition() {
      let { cd, boro, borocd, neighborhoods } = this.controller.get('model.properties');
      let mapState = this.get('mapState');
      const scroller = this.get('scroller');

      if (neighborhoods) {
        neighborhoods = neighborhoods.join(',  ');
      }

      // seeing async issues - putting inside run loop to stagger
      Ember.run.next(this, () => {
        mapState.set('currentlySelected', { 
          cd,
          boro,
          borocd,
          neighborhoods,
        });
      });
      
      const section = this.paramsFor('profile').section;
      if (section) {
        Ember.run.next(this, () => {
          scroller.scrollVertical(`#${section}`, {
            offset: -35,
          });
        });
      }
    },
    willTransition() {
      this.controllerFor('profile').set('section', '');
    }
  },
});
