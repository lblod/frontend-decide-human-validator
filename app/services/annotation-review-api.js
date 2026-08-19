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
          result.count ?? 0,
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

  createMetaObjectForCount(count, page, size) {
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
