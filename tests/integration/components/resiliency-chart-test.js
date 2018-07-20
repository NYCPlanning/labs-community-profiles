import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('resiliency-chart', 'Integration | Component | resiliency chart', {
  integration: true,
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{resiliency-chart}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#resiliency-chart}}
      template block text
    {{/resiliency-chart}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
