import Route from '@ember/routing/route';

import { service } from '@ember/service';

export default class ExpressionsRoute extends Route {
  @service store;
  @service municipalities;
  @service('options') dropdownOptions;
  @service annotationReviewApi;

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
    // not using ember data for this one as resources will not help us a lot with filtering and indirection of titles (which may be annotations themselves)
    const { expressions, meta } =
      await this.annotationReviewApi.fetchTargetExpressions(params);

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
    data.meta = meta;

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
