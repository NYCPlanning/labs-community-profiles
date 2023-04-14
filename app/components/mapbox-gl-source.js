// extends ember-mapbox-gl's source component to have an API that is more like mapbox.addSource()
import Component from '@ember/component'; // eslint-disable-line

import { getProperties, get } from '@ember/object';

export default Component.extend({
  map: null,
  id: '',
  source: {},

  init() {
    this._super();

    const { sourceId, source } = getProperties(this, 'sourceId', 'source');
    this.map.addSource(sourceId, source);
  },

  didUpdateAttrs() {
    this._super(...arguments); // eslint-disable-line

    const { sourceId, source } = getProperties(this, 'sourceId', 'source');
    this.map.getSource(sourceId).setData(source.data);
  },

  willDestroy() {
    this._super(...arguments); // eslint-disable-line
    const { sourceId } = getProperties(this, 'sourceId');
    const sourceLayers = this.map.getStyle().layers.filter(layer => layer.source === sourceId);
    console.log('sourceId', sourceId);

    sourceLayers.forEach((layer) => {
      const layerId = layer.id;
      console.log('each layer', layerId);
      if (this.map.getLayer(layerId)) {
        this.map.removeLayer(layerId);
      }
    });
    if (this.map.getSource(sourceId)) this.map.removeSource(get(this, 'sourceId'));
  },
});
