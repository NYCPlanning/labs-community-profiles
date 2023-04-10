import carto from 'labs-community-portal/utils/carto';
import { module, test } from 'qunit';

module('Unit | Utility | carto');

test('it makes a call to getVectorTileTemplate', async function(assert) {
  const result = await carto.getVectorTileTemplate(['mockQuery']);
  assert.ok(result === 'https://planninglabs.carto.com/api/v1/map/undefined/{z}/{x}/{y}.mvt');
});
