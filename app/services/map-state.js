import Ember from 'ember';
const DEFAULT_BOUNDS = [[40.690913, -74.077644], [40.856654, -73.832692]];

import carto from '../utils/carto';




export default Ember.Service.extend({
  init() {
    carto.getTileTemplate()
      .then(landUseTemplate => {
        this.set('landUseTemplate', landUseTemplate);
      });
  },
  bounds: DEFAULT_BOUNDS,
  currentlySelected: null,
});
