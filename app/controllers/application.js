import Ember from 'ember';

export default Ember.Controller.extend({
  lat: 40.7071266,
  lng: -74,
  zoom: 10,
  'tooltip-text': '',
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
