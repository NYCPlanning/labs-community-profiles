import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ranking-chart-plus', 'Integration | Component | ranking chart plus', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ranking-chart-plus}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ranking-chart-plus}}
      template block text
    {{/ranking-chart-plus}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
