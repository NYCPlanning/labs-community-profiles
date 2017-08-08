import Ember from 'ember'; // eslint-disable-line

export default Ember.Component.extend({
  lat: 40.7071266,
  lng: -74,
  zoom: 9.2,
  geomStyle: {
    fill: false,
    color: '#000',
    weight: 2,
    dashArray: '8 5',
    opacity: 0.6,
  },
  rasterSourceOptions: Ember.computed('mapState.landUseTemplate', function () {
    return {
      type: 'raster',
      tiles: [this.get('mapState.landUseTemplate')],
      tileSize: 256,
      minzoom: 14,
    };
  }),
  rasterLayerOptions: {
    id: 'landuse',
    type: 'raster',
    source: 'pluto',
    minzoom: 6,
  },
  mapState: Ember.inject.service(),
});
