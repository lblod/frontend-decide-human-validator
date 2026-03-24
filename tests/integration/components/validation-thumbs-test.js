import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend-decide/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | validation-thumbs', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<ValidationThumbs />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <ValidationThumbs>
        template block text
      </ValidationThumbs>
    `);

    assert.dom().hasText('template block text');
  });
});
