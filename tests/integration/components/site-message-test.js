import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('site-message', 'Integration | Component | site message', {
  integration: true,
});

test('it renders', function(assert) {
  this.render(hbs`
    {{site-message}}
  `);

  assert.ok(this.$().text().includes('In an effort to improve the user experience'));
});
