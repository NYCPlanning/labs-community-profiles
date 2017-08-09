// extends ember-mapbox-gl's layer component to have an API that is more like mapbox.addLayer()
import Ember from 'ember'; // eslint-disable-line

const {
  getProperties,
} = Ember;

export default Ember.Component.extend({
  map: null,
  layer: {},
  before: '',

  init() {
    this._super(...arguments);

    const { layer, before } = getProperties(this, 'layer', 'before');

    this.map.addLayer(layer, before);
  },

  willDestroy() {
    this._super(...arguments);

    this.map.removeLayer(this.layer.id);
  },
});
