import toGeojson from 'labs-community-portal/utils/to-geojson';
import { module, test } from 'qunit';

module('Unit | Utility | to geojson');

test('it works', function(assert) {
  // TODO: Replace hacked object with full district mock
  const mockDistricts = [{
    geometry: 'POINT(0,0)',
    get: () => this.geometry,
  }];
  const result = toGeojson(mockDistricts);
  assert.ok(result);
});
