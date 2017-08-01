import Ember from 'ember';

export default Ember.Controller.extend({
  lat: 45.519743,
  lng: -122.680522,
  zoom: 10,
  actions: {
    handleClick(e) {
      const { boro, cd } = e.layer.feature.properties;
      this.get('target').transitionTo('profile', boro.dasherize(), cd);
    },

    handleMouseover(e) {
      const { boro, cd } = e.layer.feature.properties;
      this.set('tooltip-text', `${boro} ${cd}`)
    }
  }
});
