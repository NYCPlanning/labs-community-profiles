import Ember from 'ember'; // eslint-disable-line
import mapboxgl from 'mapbox-gl'; // eslint-disable-line
import isCdLayer from '../utils/is-cd-layer';

export default Ember.Controller.extend({
  mapState: Ember.inject.service(),
  lat: 40.7071266,
  lng: -74,
  zoom: 9.2,

  geojson: {},

  cdSource: Ember.computed('geojson', function () {
    return {
      type: 'geojson',
      data: this.get('geojson'),
    };
  }),

  cdSelectedSource: Ember.computed('mapState.currentlySelected.geometry', function () {
    return {
      type: 'geojson',
      data: this.get('mapState.currentlySelected.geometry'),
    };
  }),

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

  cdFillLayer: {
    id: 'cd-fill',
    type: 'fill',
    source: 'cds',
    paint: {
      'fill-opacity': 0,
    },
  },

  cdLineLayer: {
    id: 'cd-line',
    type: 'line',
    source: 'cds',
    paint: {
      'line-width': 2,
      'line-color': '#ae561f',
    },
  },

  cdSelectedLayer: {
    id: 'cd-selected',
    type: 'fill',
    source: 'currentlySelected',
    paint: {
      'fill-color': '#ae561f',
      'fill-opacity': 0.2,
      'fill-outline-color': '#ae561f',
    },
  },

  cdLabelLayer: {
    id: 'cd-label',
    type: 'symbol',
    source: 'cds',
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

  mouseoverLocation: null,
  'tooltip-text': '',

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
      const firstCD = e.target.queryRenderedFeatures(e.point, { layers: ['cd-fill'] })[0];
      const { boro, cd } = firstCD.properties;

      if (boro) {
        this.transitionToRoute('profile', boro.dasherize(), cd);
      }
    },
    handleMouseover(e) {
      const firstCD = e.target.queryRenderedFeatures(e.point, { layers: ['cd-fill'] })[0];

      if (firstCD) {
        if (isCdLayer(firstCD.layer.source)) {
          e.target.getCanvas().style.cursor = 'pointer';
        } else {
          e.target.getCanvas().style.cursor = '';
        }
      }
    },
    handleMouseleave() {
      this.set('mouseoverLocation', null);
    },
    handleMapLoad(map) {
      map.addControl(new mapboxgl.NavigationControl(), 'top-left');

      const mapState = this.get('mapState');
      mapState.set('mapInstance', map);
    },
  },
});
