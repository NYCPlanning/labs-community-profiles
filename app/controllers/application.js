import Ember from 'ember'; // eslint-disable-line
import isCdLayer from '../utils/is-cd-layer';

export default Ember.Controller.extend({
  mapState: Ember.inject.service(),
  lat: 40.7071266,
  lng: -74,
  zoom: 9.2,

  cdLabels: {
    layout: {
      'text-field': '{cd}',
      'symbol-placement': 'point',
      'text-size': {
        stops: [
          [10, 14],
          [12, 30],
        ],
      },
      'icon-allow-overlap': false,
      'icon-ignore-placement': false,
      'icon-optional': false,
      'symbol-avoid-edges': true,
    },
    paint: {
      'text-color': 'rgba(66, 66, 66, 1)',
    },
  },

  cdLabelsBoro: {
    layout: {
      'text-field': '{boro}',
      'symbol-placement': 'point',
      'text-size': 12,
      'icon-allow-overlap': false,
      'icon-ignore-placement': false,
      'icon-optional': false,
      'symbol-avoid-edges': true,
      'text-offset': [0, -2.5],
    },
  },

  mouseoverLocation: null,
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
      const firstCD = e.target.queryRenderedFeatures(e.point)[0];
      const { boro, cd } = firstCD.properties;
      this.transitionToRoute('profile', boro.dasherize(), cd);
    },
    handleMouseover(e) {
      const firstCD = e.target.queryRenderedFeatures(e.point, { layer: 'cds' })[0];

      if (firstCD) {
        if (isCdLayer(firstCD.layer.source)) {
          e.target.getCanvas().style.cursor = 'pointer';
          this.set('mouseoverLocation', e.point);
          this.set('tooltip-text', `${firstCD.properties.boro} ${firstCD.properties.cd}`);
        } else {
          e.target.getCanvas().style.cursor = '';
          this.set('mouseoverLocation', null);
        }
      }
    },
    handleMouseleave(e) {
      this.set('mouseoverLocation', null);
    },
    handleMapLoad(e) {
      const mapState = this.get('mapState');
      mapState.set('mapInstance', e);
    },
  },
});
