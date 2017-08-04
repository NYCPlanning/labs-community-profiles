import Ember from 'ember'; // eslint-disable-line

export default Ember.Controller.extend({
  mapState: Ember.inject.service(),
  lat: 40.7071266,
  lng: -74,
  zoom: 10,
  'tooltip-text': '',

  selected: Ember.computed('mapState.currentlySelected', function selected() {
    return this.get('mapState.currentlySelected');
  }),

  options: Ember.computed('model.features.@each', function options() {
    const features = this.get('model.features');
    return features.map((feature) => {
      const { cd, boro, borocd } = feature.properties;
      let { neighborhoods } = feature.properties;

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

  style: Ember.computed('mapState.currentlySelected', function style() {
    return (geoJsonFeature) => {
      if (geoJsonFeature.properties.borocd === this.get('mapState.currentlySelected.borocd')) {
        return {
          fillColor: '#ae561f',
          fillOpacity: 0.2,
          color: '#ae561f',
          weight: 2,
        };
      }

      return {
        fillOpacity: 0.01,
        color: '#B95B21',
        weight: 1,
        opacity: 0.7,
      };
    };
  }),

  actions: {
    handleClick(e) {
      const { boro, cd } = e.layer.feature.properties;
      this.transitionToRoute('profile', boro.dasherize(), cd);
    },
    handleMouseover(e) {
      const { boro, cd } = e.layer.feature.properties;
      this.set('tooltip-text', `${boro} ${cd}`);
    },
    handleMapLoad(e) {
      const mapState = this.get('mapState');
      mapState.set('mapInstance', e.target);
    },
  },
});
