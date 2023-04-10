import isCdLayer from 'labs-community-portal/utils/is-cd-layer';
import { module, test } from 'qunit';

module('Unit | Utility | is cd layer');

test('it identifies cds as cdlayer', function(assert) {
  assert.ok(isCdLayer('cds'));
});

test('it identifies currentlySelected as cdlayer', function(assert) {
  assert.ok(isCdLayer('currentlySelected'));
});

test('it identifies random word as not a cdlayer', function(assert) {
  assert.ok(!isCdLayer('exampleFailure'));
});
