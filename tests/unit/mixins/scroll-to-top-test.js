import Ember from 'ember';
import ScrollToTopMixin from 'labs-community-portal/mixins/scroll-to-top';
import { module, test } from 'qunit';

module('Unit | Mixin | scroll to top');

// Replace this with your real tests.
test('it works', function(assert) {
  let ScrollToTopObject = Ember.Object.extend(ScrollToTopMixin);
  let subject = ScrollToTopObject.create();
  assert.ok(subject);
});
