import { computed } from '@ember/object'; // eslint-disable-line
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line
import isCdLayer from '../utils/is-cd-layer';

export default Controller.extend({
  mapState: service(),
  metrics: service(),
  lat: 40.7071266,
  lng: -74,
  zoom: 9.2,

  hoveredCD: '',

  geojson: {},

  cdSource: computed('geojson', function () {
    return {
      type: 'geojson',
      data: this.get('geojson'),
      promoteId: 'borocd',
    };
  }),

  cdLabelSource: {
    type: 'geojson',
    data: '/data/cd_label.geojson',
  },

  cdCurrentAddressSource: computed('mapState.currentAddress.geometry', function () {
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
      'fill-opacity': 0.2,
      'fill-color': {
        property: 'boro',
        type: 'categorical',
        stops: [
          ['Manhattan', 'DodgerBlue'],
          ['Bronx', 'Yellow'],
          ['Brooklyn', 'Coral'],
          ['Queens', 'MediumPurple'],
          ['Staten Island', 'SeaGreen'],
        ],
      },
    },
  },

  cdLineLayer: {
    id: 'cd-line',
    type: 'line',
    source: 'cds',
    paint: {
      'line-width': 1,
      'line-color': '#ae561f',
    },
  },

  cdSelectedLayer: {
    id: 'cd-selected-fill',
    type: 'fill',
    source: 'cds',
    paint: {
      'fill-color': '#ae561f',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        0.2,
        0.0,
      ],
      'fill-outline-color': '#ae561f',
    },
  },

  cdLabelLayer: {
    id: 'cd-label',
    type: 'symbol',
    source: 'cdLabel',
    layout: {
      'text-field': '{cd}',
      'text-allow-overlap': true,
      'symbol-placement': 'point',
      'text-size': {
        stops: [
          [10, 10],
          [12, 30],
        ],
      },
    },
    paint: {
      'text-color': 'rgba(66, 66, 66, 1)',
    },
  },

  cdBoroLabelLayer: {
    id: 'cd-boro-label',
    type: 'symbol',
    source: 'cdLabel',
    minzoom: 11.5,
    layout: {
      'text-field': '{boroname}',
      'text-allow-overlap': true,
      'symbol-placement': 'point',
      'text-size': 12,
      'text-offset': [0, -2.5],
    },
  },

  cdHoveredLayer: {
    id: 'cd-hovered',
    type: 'fill',
    source: 'cds',
    paint: {
      'fill-color': '#cdcdcd',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hovered'], false],
        0.5,
        0.0,
      ],
    },
  },

  mouseoverLocation: null,
  'tooltip-text': '',

  style: computed('mapState.currentlySelected', function() {
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
      const metrics = this.get('metrics');
      const firstCD = e.target.queryRenderedFeatures(e.point, { layers: ['cd-fill'] })[0];
      const { boro, cd, borocd } = firstCD.properties;

      if (boro) {
        this.transitionToRoute('profile', boro.dasherize(), cd);
      }

      metrics.trackEvent({
        eventCategory: 'Navigation Map',
        eventAction: 'Click',
        eventLabel: `${boro} ${cd}`,
        eventValue: borocd,
      });
    },
    handleMousemove(e) {
      const map = e.target;
      const mapState = this.get('mapState');
      const { currentlyHovered: previouslyHovered } = mapState;
      const currentlyHovered = map.queryRenderedFeatures(e.point, { layers: ['cd-fill'] })[0];
      const prevBorocd = previouslyHovered ? previouslyHovered.properties.borocd : null;

      const mapInstance = this.get('mapState.mapInstance');

      if (currentlyHovered) {
        if (isCdLayer(currentlyHovered.layer.source)) {
          const { borocd } = currentlyHovered.properties;
          if (!prevBorocd || (borocd !== prevBorocd)) {
            mapState.set('currentlyHovered', currentlyHovered);
            mapInstance.setFeatureState({
              source: 'cds', id: borocd,
            }, {
              hovered: true,
            });
          }

          if (prevBorocd && (borocd !== prevBorocd)) {
            mapInstance.setFeatureState({
              source: 'cds', id: prevBorocd,
            }, {
              hovered: false,
            });
          }
          map.getCanvas().style.cursor = 'pointer';
        }
      } else {
        if (prevBorocd) {
          mapInstance.setFeatureState({
            source: 'cds', id: prevBorocd,
          }, {
            hovered: false,
          });
        }
        this.set('mouseoverLocation', null);
        mapState.set('currentlyHovered', null);
        map.getCanvas().style.cursor = '';
      }
    },

    handleMouseout() {
      const mapState = this.get('mapState');
      const { currentlyHovered } = mapState;
      const borocd = currentlyHovered ? currentlyHovered.properties.borocd : null;
      if (borocd) {
        mapState.mapInstance.setFeatureState({
          source: 'cds', id: borocd,
        },
        {
          hovered: false,
        });
      }
      mapState.set('currentlyHovered', null);
    },

    handleMapLoad(map) {
      window.map = map;
      map.addControl(new mapboxgl.NavigationControl(), 'top-left');

      const mapState = this.get('mapState');
      mapState.set('mapInstance', map);

      map.on('idle', () => {
        const selectedBorocd = mapState.get('currentlySelected.borocd');
        if (selectedBorocd) {
          map.setFeatureState({
            source: 'cds', id: selectedBorocd,
          }, {
            selected: true,
          });
        }
      });
    },
  },
});
