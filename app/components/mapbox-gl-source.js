// extends ember-mapbox-gl's source component to have an API that is more like mapbox.addSource()
import Ember from 'ember'; // eslint-disable-line
// import mapboxGlSource from 'ember-mapbox-gl/components/mapbox-gl-source'; // eslint-disable-line

const {
  get,
  getProperties,
} = Ember;

export default Ember.Component.extend({
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
