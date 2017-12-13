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
    this._super(...arguments);

    const { sourceId, source } = getProperties(this, 'sourceId', 'source');
    this.map.getSource(sourceId).setData(source.data);
  },

  willDestroy() {
    this._super(...arguments);

    this.map.removeSource(get(this, 'sourceId'));
  },
});
