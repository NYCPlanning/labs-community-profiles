import Ember from 'ember';

export default Ember.Controller.extend({
  lat: 45.519743,
  lng: -122.680522,
  zoom: 10,
  actions: {
    handleClick(e) {
      const { boro, borocd } = e.layer.feature.properties;
      this.transitionToRoute('profile', boro.dasherize(), borocd);
    },

    handleMouseover(e) {
      const { boro, cd } = e.layer.feature.properties;
      this.set('tooltip-text', `${boro} ${cd}`)
    }
  }
});
