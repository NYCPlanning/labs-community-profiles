import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | age pyramid', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });


    // Template block usage:
    await this.render(hbs`
    {{#age-pyramid}}
      template block text
    {{/age-pyramid}}
  `);

    assert.ok(this.$().text().trim().includes('Female'));
    assert.ok(this.$().text().trim().includes('template block text'));
  });
});
