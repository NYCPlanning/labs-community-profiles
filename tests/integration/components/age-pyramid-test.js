import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('age-pyramid', 'Integration | Component | age pyramid', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{age-pyramid}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#age-pyramid}}
      template block text
    {{/age-pyramid}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
