import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ExpressionsRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
  };

  async model(params) {
    // not using ember data for this one as resources will not help us a lot with filtering and indirection of titles (which may be annotations themselves)
    const response = await fetch(
      `/annotation-review/targets/expression?page=${params.page}&pageSize=${params.size}`,
    );
    const result = await response.json();

    const expressions = result.targets;

    await this.store.query('expression', {
      filter: {
        id: expressions.map((expression) => expression.id).join(','),
      },
      include: 'realizes,realizes.passed-by,is-embodied-by',
      page: {
        size: 999,
      },
    });

    const data = expressions.map((expression) => {
      expression.model = this.store.peekRecord('expression', expression.id);
      return expression;
    });
    data.meta = {
      count: result.count,
      pagination: {
        // we can be a little rough with prev and next as the datatable checks the first and last anyway
        prev: { number: params.page - 1, size: result.count },
        next: { number: params.page + 1, size: result.count },
        first: { number: 0, size: result.count },
        last: {
          number: Math.floor(result.count / params.size) - 1,
          size: result.count,
        },
      },
    };
    return data;
  }
}
