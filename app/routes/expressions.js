import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ExpressionsRoute extends Route {
  @service store;
  @service municipalities;
  @service('options') dropdownOptions;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    municipality: { refreshModel: true },
    predicates: { refreshModel: true },
    aimodels: { refreshModel: true },
    types: { refreshModel: true },
    title: { refreshModel: true },
  };

  async model(params) {
    const selectedMunicipalityFilter = this.municipalities.toMunicipalityFilter(
      params.municipality,
    );

    let titleFilter = '';
    if (params.title && params.title.length > 3) {
      titleFilter = `&filter[title]=${encodeURIComponent(params.title)}`;
    }
    let predicatesFilter = '';
    if (params.predicates) {
      const escaped = params.predicates
        .split(',')
        .map((_uri) => encodeURIComponent(_uri));
      predicatesFilter = `&filter[predicates]=${escaped.join(',')}`;
    }
    let byAiModelsFilter = '';
    if (params.aimodels) {
      const escaped = params.aimodels
        .split(',')
        .map((_uri) => encodeURIComponent(_uri));
      byAiModelsFilter = `&filter[aiModels]=${escaped.join(',')}`;
    }
    let valueTypesFilter = '';
    if (params.types) {
      const escaped = params.types
        .split(',')
        .map((_uri) => encodeURIComponent(_uri));
      valueTypesFilter = `&filter[valueTypes]=${escaped.join(',')}`;
    }

    // not using ember data for this one as resources will not help us a lot with filtering and indirection of titles (which may be annotations themselves)
    const response = await fetch(
      `/annotation-review/targets/expression?page=${params.page}&pageSize=${params.size}${selectedMunicipalityFilter}${titleFilter}${predicatesFilter}${byAiModelsFilter}${valueTypesFilter}`,
    );
    const result = await response.json();

    const expressions = result.targets;

    const [expressionModels, municipalityModels] = await Promise.all([
      this.store.query('expression', {
        filter: {
          id: expressions.map((expression) => expression.id).join(','),
        },
        include: 'realizes,realizes.passed-by,is-embodied-by',
        page: {
          size: 999,
        },
      }),
      this.municipalities.getMunicipalities(params.municipality),
    ]);

    const data = expressions.map((expression) => {
      expression.model = expressionModels.find((m) => m.id === expression.id);
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
          number: Math.floor(result.count / params.size),
          size: result.count,
        },
      },
    };
    return {
      expressions: data,
      municipalities: municipalityModels,
      predicateOptions: await this.dropdownOptions.predicates(),
      aiModelOptions: await this.dropdownOptions.aiModels(),
      typeOptions: await this.dropdownOptions.valueTypes(),
      search: params.title,
      commonDetailPageParams: {
        predicates: params.predicates,
        aimodels: params.aimodels,
        types: params.types,
      },
    };
  }

  setupController(controller, model) {
    super.setupController(...arguments);
    controller.search = model.search;
  }
}
