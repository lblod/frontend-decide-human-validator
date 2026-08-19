import Service, { service } from '@ember/service';

export default class AnnotationReviewApiService extends Service {
  @service municipalities;

  async fetchTargetExpressions(queryParams) {
    const selectedMunicipalityFilter = this.municipalities.toMunicipalityFilter(
      queryParams.municipality,
    );

    let titleFilter = '';
    if (queryParams.title && queryParams.title.length > 3) {
      titleFilter = `&filter[title]=${encodeURIComponent(queryParams.title)}`;
    }
    let predicatesFilter = '';
    if (queryParams.predicates) {
      const escaped = queryParams.predicates
        .split(',')
        .map((_uri) => encodeURIComponent(_uri));
      predicatesFilter = `&filter[predicates]=${escaped.join(',')}`;
    }
    let byAiModelsFilter = '';
    if (queryParams.aimodels) {
      const escaped = queryParams.aimodels
        .split(',')
        .map((_uri) => encodeURIComponent(_uri));
      byAiModelsFilter = `&filter[aiModels]=${escaped.join(',')}`;
    }
    let valueTypesFilter = '';
    if (queryParams.types) {
      const escaped = queryParams.types
        .split(',')
        .map((_uri) => encodeURIComponent(_uri));
      valueTypesFilter = `&filter[valueTypes]=${escaped.join(',')}`;
    }

    try {
      const response = await fetch(
        `/annotation-review/targets/expression?page=${queryParams.page}&pageSize=${queryParams.size}${selectedMunicipalityFilter}${titleFilter}${predicatesFilter}${byAiModelsFilter}${valueTypesFilter}`,
      );
      const result = await response.json();
      return {
        expressions: result?.targets ?? [],
        meta: this.createMetaObjectForCount(
          result.count,
          queryParams.page ?? 0,
          queryParams.size ?? 20,
        ),
      };
    } catch (_error) {
      throw Error(
        `Could not fetch target expression from annotation-review-api`,
      );
    }
  }

  async fetchTargetExpressionLabels(queryParams) {
    let filter = '';
    if (queryParams.hideVoted !== false) {
      filter += '&filter[ignoreAlreadyReviewed]=true';
    }
    if (queryParams.concepts) {
      filter += `&filter[concept]=${queryParams.concepts}`;
    }
    if (queryParams.conceptScheme) {
      filter += `&filter[conceptScheme]=${queryParams.conceptScheme}`;
    }
    if (queryParams.year) {
      filter += `&filter[year]=${queryParams.year}`;
    }
    if (queryParams.impact) {
      filter += `&filter[impact]=${queryParams.impact}`;
    }
    if (queryParams.title && queryParams.title.length > 3) {
      filter += `&filter[title]=${queryParams.title}`;
    }
    filter += this.municipalities.toMunicipalityFilter(
      queryParams.municipality,
    );

    try {
      const annotationResult = await fetch(
        `/annotation-review/annotations/expression-label?page=${queryParams.page}&pageSize=${queryParams.size}${filter}`,
      );

      const { annotations, annotationCount } = await annotationResult.json();

      return {
        annotations: annotations ?? [],
        meta: this.createMetaObjectForCount(
          annotationCount,
          queryParams.page ?? 0,
          queryParams.size ?? 20,
        ),
      };
    } catch (_error) {
      throw Error(
        `Could not fetch target expression labels from annotation-review-api`,
      );
    }
  }

  createMetaObjectForCount(count, page, size) {
    if (!count) {
      return null;
    }
    return {
      count: count,
      pagination: {
        // we can be a little rough with prev and next as the datatable checks the first and last anyway
        prev: { number: page - 1, size: count },
        next: { number: page + 1, size: count },
        first: { number: 0, size: count },
        last: {
          number: Math.floor(count / size),
          size: count,
        },
      },
    };
  }
}
