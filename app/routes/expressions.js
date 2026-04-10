import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ExpressionsRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    selectedMunicipalityUri: { refreshModel: true },
  };

  async model(params) {
    const selectedMunicipalityFilter = params.selectedMunicipalityUri
      ? `&filter[municipality]=${params.selectedMunicipalityUri}`
      : null;
    // not using ember data for this one as resources will not help us a lot with filtering and indirection of titles (which may be annotations themselves)
    const response = await fetch(
      `/annotation-review/targets/expression?page=${params.page}&pageSize=${params.size}${selectedMunicipalityFilter}`,
    );
    const result = await response.json();

    const expressions = result.targets;
    const orgFilter = {
      filter: {
        classification:
          'http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000001',
      },
      page: {
        size: 20,
      },
      sort: 'pref-label',
    };
    if (params.selectedMunicipalityUri) {
      orgFilter.filter[':uri:'] = params.selectedMunicipalityUri;
    }

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
      this.store.query('organization', orgFilter),
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
    };
  }
}
