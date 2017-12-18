import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('floodplain-charts', 'Integration | Component | floodplain charts', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{floodplain-charts}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#floodplain-charts}}
      template block text
    {{/floodplain-charts}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
