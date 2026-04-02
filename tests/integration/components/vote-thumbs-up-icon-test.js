import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend-decide-human-validator/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | vote-thumbs-up-icon', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<VoteThumbsUpIcon />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <VoteThumbsUpIcon>
        template block text
      </VoteThumbsUpIcon>
    `);

    assert.dom().hasText('template block text');
  });
});
