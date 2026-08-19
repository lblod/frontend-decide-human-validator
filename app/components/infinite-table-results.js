import Component from '@glimmer/component';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { task } from 'ember-concurrency';

export default class InfiniteTableResults extends Component {
  @tracked page = 0;
  @tracked hasMore = false;
  @tracked items = [];

  get lastVisibleItemTrigger() {
    const loadMoreWhenLastItemsAreVisible = 2;
    return this.items[this.items.length - loadMoreWhenLastItemsAreVisible];
  }

  constructor() {
    super(...arguments);
    this.fetchResults.perform(this.page);
  }

  fetchResults = task({ enqueue: true }, async (page) => {
    console.log('fetch results for page', page);
    const items = await this.args.onLoadMore?.(page);

    const newItems = items ?? [];
    this.hasMore = newItems.length === this.args.size;

    if (newItems.length) {
      this.items = [...this.items, ...newItems];
    }
  });

  observeIfNearEnd = modifier((element) => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.maybeLoadNextPage();
          }
        }
      },
      { threshold: 0 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  });

  @action
  maybeLoadNextPage() {
    if (this.fetchResults.isRunning) return;
    if (!this.hasMore) return;

    this.page = this.page + 1;
    this.fetchResults.perform(this.page);
  }
}
