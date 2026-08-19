import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ValidateExpressionLabelsRoute extends Route {
  @service store;
  @service municipalities;
  @service('options') dropdownOptions;
  @service annotationReviewApi;

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
    title: { refreshModel: true },
    municipality: { refreshModel: true },
  };

  async model(params) {
    const conceptSchemes = await this.dropdownOptions.hvtConceptSchemes();

    let concepts = [];
    let selectedConcepts = [];
    if (params.conceptScheme) {
      concepts = [
        ...(await this.store.query('concept', {
          'filter[concept-scheme][id]': params.conceptScheme,
          sort: 'notation',
          page: {
            size: 9999,
          },
        })),
        {
          prefLabel: 'No Match',
          id: 'b8fb6be7-c063-4e87-a3af-4cca5685cdbd',
          uri: 'http://mu.semte.ch/vocabularies/ext/no-match-found',
        },
      ];
      const conceptIds = (params.concepts || '').split(',');
      selectedConcepts = concepts.filter((concept) => {
        return conceptIds.includes(concept.id);
      });
      if (selectedConcepts.length === 0 && !params.dsAll) {
        selectedConcepts = concepts;
      }
    }

    return {
      params: params,
      conceptSchemes,
      concepts,
      conceptSchemeId: params.conceptScheme,
      selectedConcepts,
      search: params.title,
      municipalities: await this.municipalities.getMunicipalities(
        params.municipality,
      ),
    };
  }

  setupController(controller, model) {
    super.setupController(...arguments);
    controller.search = model.search;
  }
}
