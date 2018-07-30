// extends ember-mapbox-gl's layer component to have an API that is more like mapbox.addLayer()
import Component from '@ember/component'; // eslint-disable-line

import { getProperties } from '@ember/object';

export default Component.extend({
  map: null,
  layer: {},
  before: '',

  init() {
    this._super(...arguments); // eslint-disable-line

    const { layer, before } = getProperties(this, 'layer', 'before');

    this.map.addLayer(layer, before);
  },

  willDestroy() {
    this._super(...arguments); // eslint-disable-line

    this.map.removeLayer(this.layer.id);
  },
});
