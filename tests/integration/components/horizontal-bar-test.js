import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('horizontal-bar', 'Integration | Component | horizontal bar', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{horizontal-bar}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#horizontal-bar}}
      template block text
    {{/horizontal-bar}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
