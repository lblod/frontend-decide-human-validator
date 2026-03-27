import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ValidateExpressionLabelsRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
  };

  async model(params) {
    const annotationResult = await fetch(
      `/annotation-review/annotations/expression?page=${params.page}&pageSize=${params.size}`,
    );

    const { annotations, annotationCount } = await annotationResult.json();

    await this.store.query('annotation', {
      filter: {
        id: annotations.map((annotation) => annotation.id).join(','),
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
          number: Math.floor(annotationCount / params.size) - 1,
          size: annotationCount,
        },
      },
    };

    return {
      annotations: annotationData,
    };
  }
}
