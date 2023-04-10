import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | horizontal bar', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

    await this.render(hbs`{{horizontal-bar}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    await this.render(hbs`
    {{#horizontal-bar}}
      template block text
    {{/horizontal-bar}}
  `);

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
