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
    return {
      params: params,
      municipalities: await this.municipalities.getMunicipalities(
        params.municipality,
      ),
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
