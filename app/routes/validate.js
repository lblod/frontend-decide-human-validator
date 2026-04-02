import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ValidateRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
  };

  async model(params) {
    const [expression, annotationResult] = await Promise.all([
      this.store.findRecord('expression', params.expression_id, {
        include: 'annotations,realizes,realizes.passed-by',
      }),
      fetch(
        `/annotation-review/annotations/expression/${params.expression_id}?page=${params.page}&pageSize=${params.size}`,
      ),
    ]);

    const {
      annotations,
      annotationCount,
      target: expressionData,
    } = await annotationResult.json();

    await this.store.query('annotation', {
      filter: {
        id: annotations.map((expression) => expression.id).join(','),
      },
      page: {
        size: 999,
      },
    });

    const annotationData = annotations.map((annotation) => {
      annotation.model = this.store.peekRecord('annotation', annotation.id);
      return annotation;
    });
    annotationData.meta = {
      count: annotationCount,
      pagination: {
        // we can be a little rough with prev and next as the datatable checks the first and last anyway
        prev: { number: params.page - 1, size: annotationCount },
        next: { number: params.page + 1, size: annotationCount },
        first: { number: 0, size: annotationCount },
        last: {
          number: Math.floor(annotationCount / params.size),
          size: annotationCount,
        },
      },
    };

    return {
      title: expressionData.title,
      expression,
      annotations: annotationData,
    };
  }

  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== 'validate') {
      controller.set('page', 0);
    }
  }
}
