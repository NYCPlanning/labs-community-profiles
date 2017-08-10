import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('key-indicator', 'Integration | Component | key indicator', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{key-indicator}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#key-indicator}}
      template block text
    {{/key-indicator}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
