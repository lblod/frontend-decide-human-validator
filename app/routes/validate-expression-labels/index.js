import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ValidateExpressionLabelsIndexRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
  };

  async model(params) {
    const { filter } = this.modelFor('validate-expression-labels');
    const { hideVoted } = this.paramsFor('validate-expression-labels');
    const hideVotedFilter =
      hideVoted !== false ? '&filter[ignoreAlreadyReviewed]=true' : '';

    const annotationResult = await fetch(
      `/annotation-review/annotations/expression-label?page=${params.page}&pageSize=${params.size}${hideVotedFilter}${filter}`,
    );
    const { annotations, annotationCount } = await annotationResult.json();

    const annotationData = await this.addAnnotationModels(annotations);
    const annotationDataWithExpressions =
      await this.addExpressionTargets(annotationData);
    annotationDataWithExpressions.meta = {
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
    return annotationDataWithExpressions;
  }

  async addAnnotationModels(annotations) {
    await this.store.query('annotation', {
      filter: {
        id: annotations.map((annotation) => annotation.id).join(','),
      },
      page: {
        size: 999,
      },
    });

    return annotations.map((annotation) => {
      annotation.model = this.store.peekRecord('annotation', annotation.id);
      return annotation;
    });
  }

  async addExpressionTargets(annotations) {
    await this.store.query('expression', {
      filter: {
        id: annotations.map((annotation) => annotation.targetId).join(','),
      },
      page: {
        size: 999,
      },
    });

    return annotations.map((annotation) => {
      annotation.targetModel = this.store.peekRecord(
        'expression',
        annotation.targetId,
      );
      return annotation;
    });
  }
}
