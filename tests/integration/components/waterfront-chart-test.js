import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('waterfront-chart', 'Integration | Component | waterfront chart', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{waterfront-chart}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#waterfront-chart}}
      template block text
    {{/waterfront-chart}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
