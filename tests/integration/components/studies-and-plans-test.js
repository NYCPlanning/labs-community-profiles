import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('studies-and-plans', 'Integration | Component | studies and plans', {
  integration: true,
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{studies-and-plans}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#studies-and-plans}}
      template block text
    {{/studies-and-plans}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
