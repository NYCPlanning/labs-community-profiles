// extends ember-mapbox-gl's source component to have an API that is more like mapbox.addSource()
import { scheduleOnce } from '@ember/runloop';
import Component from '@ember/component'; // eslint-disable-line

import { getProperties } from '@ember/object';

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
    const { sourceId } = this;
    scheduleOnce('afterRender', this.map, this.map.removeSource, sourceId);
  },
});
