import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ValidateExpressionLabelsRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    concepts: { refreshModel: true },
    conceptScheme: { refreshModel: true },
    showImpact: { refreshModel: false },
    showCs: { refreshModel: false },
    impact: { refreshModel: true },
    year: { refreshModel: true },
    dsAll: { refreshModel: true },
    hideVoted: { refreshModel: true },
  };

  async model(params) {
    let filter = '';
    if (params.hideVoted !== false) {
      filter += '&filter[ignoreAlreadyReviewed]=true';
    }
    if (params.concepts) {
      filter += `&filter[concept]=${params.concepts}`;
    }
    if (params.conceptScheme) {
      filter += `&filter[conceptScheme]=${params.conceptScheme}`;
    }
    if (params.year) {
      filter += `&filter[year]=${params.year}`;
    }
    if (params.impact) {
      filter += `&filter[impact]=${params.impact}`;
    }

    const annotationResult = await fetch(
      `/annotation-review/annotations/expression-label?page=${params.page}&pageSize=${params.size}${filter}`,
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

    const schemeFilter = {
      filter: {
        'show-in-hvt': true,
      },
    };
    if (params.conceptScheme) {
      schemeFilter.filter.id = params.conceptScheme;
    }
    const conceptSchemes = await this.store.query(
      'concept-scheme',
      schemeFilter,
    );

    let concepts = [];
    let selectedConcepts = [];
    if (params.conceptScheme) {
      concepts = await this.store.query('concept', {
        'filter[concept-scheme][id]': params.conceptScheme,
        sort: 'notation',
        page: {
          size: 9999,
        },
      });
      const conceptIds = (params.concepts || '').split(',');
      selectedConcepts = concepts.filter((concept) => {
        return conceptIds.includes(concept.id);
      });
      if (selectedConcepts.length === 0 && !params.dsAll) {
        selectedConcepts = concepts;
      }
    }

    return {
      annotations: annotationDataWithExpressions,
      conceptSchemes,
      concepts,
      selectedConcepts,
    };
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
