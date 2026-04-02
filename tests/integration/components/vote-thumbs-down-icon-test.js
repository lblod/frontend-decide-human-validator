import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend-decide-human-validator/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | vote-thumbs-down-icon', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<VoteThumbsDownIcon />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <VoteThumbsDownIcon>
        template block text
      </VoteThumbsDownIcon>
    `);

    assert.dom().hasText('template block text');
  });
});
