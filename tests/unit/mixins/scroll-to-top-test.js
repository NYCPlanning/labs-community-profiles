import EmberObject from '@ember/object';
import ScrollToTopMixin from 'labs-community-portal/mixins/scroll-to-top';
import { module, test } from 'qunit';

module('Unit | Mixin | scroll to top');

// Replace this with your real tests.
test('it works', function(assert) {
  const ScrollToTopObject = EmberObject.extend(ScrollToTopMixin);
  const subject = ScrollToTopObject.create();
  assert.ok(subject);
});
