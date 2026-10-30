import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ValidateExpressionLabelsRoute extends Route {
  @service store;
  @service intl;
  @service municipalities;
  @service('options') dropdownOptions;

  queryParams = {
    concepts: { refreshModel: true },
    conceptScheme: { refreshModel: true },
    showImpact: { refreshModel: false },
    showCs: { refreshModel: false },
    impact: { refreshModel: true },
    year: { refreshModel: true },
    dsAll: { refreshModel: true },
    hideVoted: { refreshModel: true },
    title: { refreshModel: true },
    content: { refreshModel: true },
    municipality: { refreshModel: true },
  };

  async model(params) {
    let filter = '';
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
    if (params.title && params.title.length > 3) {
      filter += `&filter[title]=${params.title}`;
    }
    if (params.content && params.content.length > 3) {
      filter += `&filter[content]=${params.content}`;
    }
    filter += this.municipalities.toMunicipalityFilter(params.municipality);

    const [municipalityModels, conceptSchemes] = await Promise.all([
      this.municipalities.getMunicipalities(params.municipality),
      this.dropdownOptions.hvtConceptSchemes(),
    ]);

    let concepts = [];
    let selectedConcepts = [];
    if (params.conceptScheme) {
      const intl = this.intl;
      concepts = [
        ...(await this.store.query('concept', {
          'filter[concept-scheme][id]': params.conceptScheme,
          sort: 'notation',
          page: {
            size: 9999,
          },
        })),
        {
          // getter so the label follows a language switch without a reload
          get label() {
            return intl.t('expression-annotation-no-match');
          },
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
      conceptSchemes,
      concepts,
      conceptSchemeId: params.conceptScheme,
      selectedConcepts,
      search: params.title,
      contentSearch: params.content,
      municipalities: municipalityModels,
      filter,
    };
  }

  setupController(controller, model) {
    super.setupController(...arguments);
    controller.search = model.search;
    controller.contentSearch = model.contentSearch;
  }
}
