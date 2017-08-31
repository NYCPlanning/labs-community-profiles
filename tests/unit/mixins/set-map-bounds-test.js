import Ember from 'ember';
import SetMapBoundsMixin from 'labs-community-portal/mixins/set-map-bounds';
import { module, test } from 'qunit';

module('Unit | Mixin | set map bounds');

// Replace this with your real tests.
test('it works', function(assert) {
  let SetMapBoundsObject = Ember.Object.extend(SetMapBoundsMixin);
  let subject = SetMapBoundsObject.create();
  assert.ok(subject);
});
