import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | 197a plans', function (hooks) {
  setupRenderingTest(hooks);
  test('it renders', async function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

    await this.render(hbs`{{197a-plans}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    await this.render(hbs`
    {{#197a-plans}}
      template block text
    {{/197a-plans}}
  `);

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
