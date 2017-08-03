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
      let { cd, boro, borocd, neighborhoods } = feature.properties;

      if (neighborhoods) {
        neighborhoods = neighborhoods.join(',  ');
      }

      return { 
        cd,
        boro,
        borocd,
        neighborhoods,
        name: `${boro} ${cd} - ${neighborhoods}`,
      };
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
    },
    handleMapLoad(e) {
      let mapState = this.get('mapState');
      mapState.set('mapInstance', e.target);
    }
  }
});
