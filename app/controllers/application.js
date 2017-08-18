import Ember from 'ember'; // eslint-disable-line
import mapboxgl from 'mapbox-gl'; // eslint-disable-line
import isCdLayer from '../utils/is-cd-layer';

export default Ember.Controller.extend({
  mapState: Ember.inject.service(),
  lat: 40.7071266,
  lng: -74,
  zoom: 9.2,

  hoveredCD: '',

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

  cdHoveredSource: Ember.computed('mapState.currentlyHovered', function () {
    return {
      type: 'geojson',
      data: this.get('mapState.currentlyHovered'),
    };
  }),

  cdBoroLabelLayer: {
    id: 'cd-boro-label',
    type: 'symbol',
    source: 'cds',
    minzoom: 11.5,
    layout: {
      'text-field': '{boro}',
      'text-allow-overlap': true,
      'symbol-placement': 'point',
      'text-size': 12,
      'text-offset': [0, -2.5],
    },
  },

  cdCurrentAddressSource: Ember.computed('mapState.currentAddress.geometry', function () {
    return {
      type: 'geojson',
      data: this.get('mapState.currentAddress.geometry'),
    };
  }),

  cdPointLayer: {
    id: 'cd-circle',
    type: 'circle',
    source: 'currentAddress',
    paint: {
      'circle-radius': 3,
      'circle-color': 'blue',
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
      'text-allow-overlap': true,
      'symbol-placement': 'point',
      'text-size': {
        stops: [
          [10, 14],
          [12, 30],
        ],
      },
    },
    paint: {
      'text-color': 'rgba(66, 66, 66, 1)',
    },
  },

  cdHoveredLayer: {
    id: 'cd-hovered',
    type: 'fill',
    source: 'cd-hovered',
    paint: {
      'fill-color': '#cdcdcd',
      'fill-opacity': 0.5,
    },
  },

  mouseoverLocation: null,
  'tooltip-text': '',

  style: Ember.computed('mapState.currentlySelected', function() {
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
    handleMousemove(e) {
      const map = e.target;
      const mapState = this.get('mapState');
      const { currentlyHovered } = mapState;
      const firstCD = map.queryRenderedFeatures(e.point, { layers: ['cd-fill'] })[0];

      if (firstCD) {
        if (isCdLayer(firstCD.layer.source)) {
          const borocd = firstCD.properties.borocd;
          const prevBorocd = currentlyHovered ? currentlyHovered.properties.borocd : null;
          if (!currentlyHovered || (borocd !== prevBorocd)) {
            mapState.set('currentlyHovered', firstCD);
          }
          map.getCanvas().style.cursor = 'pointer';
        }
      } else {
        this.set('mouseoverLocation', null);
        mapState.set('currentlyHovered', null);
        map.getCanvas().style.cursor = '';
      }
    },

    handleMapLoad(map) {
      map.addControl(new mapboxgl.NavigationControl(), 'top-left');

      const mapState = this.get('mapState');
      mapState.set('mapInstance', map);
    },
  },
});
