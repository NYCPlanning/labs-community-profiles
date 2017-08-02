import Ember from 'ember';

export default Ember.Controller.extend({
  mapState: Ember.inject.service(),
  lat: 40.7071266,
  lng: -74,
  zoom: 10,
  'tooltip-text': '',

  selected: Ember.computed('mapState.currentlySelected', function() {
    return this.get('mapState.currentlySelected');
  }),

  options: Ember.computed('model.features.@each', function() {
    let features = this.get('model.features');
    return features.map(feature=> { 
      return { 
        cd: `${feature.properties.boro} ${feature.properties.cd}`, 
        boro: feature.properties.boro,
        borocd: feature.properties.borocd,
      } 
    });
  }),

  style: Ember.computed('mapState.currentlySelected', function() {
    return (geoJsonFeature) => {
      if(geoJsonFeature.properties.borocd == this.get('mapState.currentlySelected.borocd')) {
        return {
          fillColor: 'purple'
        }
      }
    }
  }),

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
