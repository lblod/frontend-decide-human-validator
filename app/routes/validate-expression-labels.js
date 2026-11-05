import Route from '@ember/routing/route';
import { service } from '@ember/service';

import { compareByNotation } from '../utils/natural-sort';

export default class ValidateExpressionLabelsRoute extends Route {
  @service store;
  @service intl;
  @service municipalities;
  @service provinces;
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
    description: { refreshModel: true },
    municipality: { refreshModel: true },
    province: { refreshModel: true },
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
    if (params.description && params.description.length > 3) {
      filter += `&filter[description]=${params.description}`;
    }
    filter += this.municipalities.toMunicipalityFilter(params.municipality);
    filter += this.provinces.toProvinceFilter(params.province);

    const [municipalityModels, provinceModels] = await Promise.all([
      this.municipalities.getMunicipalities(
        params.municipality,
        params.province,
      ),
      this.provinces.getProvinces(params.province),
      this.dropdownOptions.hvtConceptSchemes(),
    ]);

    const schemeFilter = {
      filter: {
        'show-in-hvt': true,
        ':id:': '6673ad10-0f68-5e7d-81b1-c74828de3879',
      },
    };
    const conceptSchemes = [
      ...(await this.store.query('concept-scheme', schemeFilter)),
    ];
    if (
      params.conceptScheme &&
      !conceptSchemes.find((s) => s.id == params.conceptScheme)
    ) {
      schemeFilter.filter.id = params.conceptScheme;
      const selectedScheme = await this.store.query(
        'concept-scheme',
        schemeFilter,
      );
      conceptSchemes.push(selectedScheme);
    }

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
      ];
      // The API sorts alphabetically, which mis-orders notations like
      // "A20" (before "A3"). Re-sort naturally on the client instead.
      concepts.sort(compareByNotation);
      // "No match" has no notation, so add it after sorting to keep it last.
      const intl = this.intl;
      concepts.push({
        get label() {
          return intl.t('expression-annotation-no-match');
        },
        get displayLabel() {
          return this.label;
        },
        get prefLabel() {
          return this.label;
        },
        id: 'b8fb6be7-c063-4e87-a3af-4cca5685cdbd',
        uri: 'http://mu.semte.ch/vocabularies/ext/no-match-found',
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
      conceptSchemes,
      concepts,
      conceptSchemeId: params.conceptScheme,
      selectedConcepts,
      search: params.description,
      titleSearch: params.title,
      municipalities: municipalityModels,
      provinces: provinceModels,
      filter,
    };
  }

  setupController(controller, model) {
    super.setupController(...arguments);
    controller.search = model.search;
    controller.titleSearch = model.titleSearch;
  }
}
