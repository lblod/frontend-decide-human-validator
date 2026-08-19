import Component from '@glimmer/component';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { task } from 'ember-concurrency';

export default class InfiniteTableResults extends Component {
  @tracked page = 0;
  @tracked hasMore = false;
  @tracked totalCount = null;
  @tracked items = [];

  get lastVisibleItemTrigger() {
    const fiftyProcentShown = 0.5;
    const offset = this.args.size
      ? Math.max(2, Math.floor(this.args.size * fiftyProcentShown))
      : 2;
    return this.items[this.items.length - offset];
  }

  constructor() {
    super(...arguments);
    if (this.args.initialState) {
      this.items = this.args.initialState.items;
      this.page = this.args.initialState.page;
      this.hasMore = this.args.initialState.hasMore;
      this.totalCount = this.args.initialState.totalCount;
    } else {
      this.fetchResults.perform(this.page);
    }
  }

  fetchResults = task({ enqueue: true }, async (page) => {
    const items = await this.args.onLoadMore?.(page);

    const newItems = items ?? [];
    this.hasMore = newItems.length === this.args.size;

    if (newItems.length) {
      this.items = [...this.items, ...newItems];
    }
    this.totalCount = items.meta?.count ?? 'unknown';

    this.args.onItemsUpdated?.({
      items: this.items,
      page: this.page,
      hasMore: this.hasMore,
      totalCount: this.totalCount,
    });
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
