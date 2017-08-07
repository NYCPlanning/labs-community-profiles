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
  rasterOptions: Ember.computed('mapState.landUseTemplate', function () {
    return {
      type: 'raster',
      tiles: [this.get('mapState.landUseTemplate')],
      tileSize: 256,
    };
  }),
  mapState: Ember.inject.service(),
});
