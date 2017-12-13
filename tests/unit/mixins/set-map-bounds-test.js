import EmberObject from '@ember/object';
import SetMapBoundsMixin from 'labs-community-portal/mixins/set-map-bounds';
import { module, test } from 'qunit';

module('Unit | Mixin | set map bounds');

// Replace this with your real tests.
test('it works', function(assert) {
  let SetMapBoundsObject = EmberObject.extend(SetMapBoundsMixin);
  let subject = SetMapBoundsObject.create();
  assert.ok(subject);
});
