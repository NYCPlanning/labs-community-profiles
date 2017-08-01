import Ember from 'ember';
const DEFAULT_BOUNDS = [[40.690913, -74.077644], [40.856654, -73.832692]];

export default Ember.Service.extend({
  bounds: DEFAULT_BOUNDS,
  currentlySelected: null
});
