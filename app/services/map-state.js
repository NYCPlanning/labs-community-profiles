import Service from '@ember/service'; // eslint-disable-line
const DEFAULT_BOUNDS = [-74.077644, 40.690913, -73.832692, 40.856654];

export default Service.extend({
  bounds: DEFAULT_BOUNDS,
  currentlySelected: null,
  mapInstance: null,
  currentAddress: null,
});
