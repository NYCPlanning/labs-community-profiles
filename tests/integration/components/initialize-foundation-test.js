import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('initialize-foundation', 'Integration | Component | initialize foundation', {
  integration: true,
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{initialize-foundation}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#initialize-foundation}}
      template block text
    {{/initialize-foundation}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
