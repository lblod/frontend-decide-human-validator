import Route from '@ember/routing/route';
import { service } from '@ember/service';

// Natural sort helper so notations like "A2", "A3", "A20", "A3.1" sort in
// the order a human expects, instead of alphabetically (which would put
// "A20" right after "A2" and before "A3").
function naturalCompare(a = '', b = '') {
  const chunksA = String(a).match(/\d+|\D+/g) || [];
  const chunksB = String(b).match(/\d+|\D+/g) || [];
  const length = Math.max(chunksA.length, chunksB.length);

  for (let i = 0; i < length; i++) {
    const chunkA = chunksA[i] ?? '';
    const chunkB = chunksB[i] ?? '';

    if (chunkA === chunkB) continue;

    const numA = Number(chunkA);
    const numB = Number(chunkB);
    const bothNumeric = chunkA !== '' && chunkB !== '' && !isNaN(numA) && !isNaN(numB);

    if (bothNumeric) {
      if (numA !== numB) return numA - numB;
    } else {
      return chunkA < chunkB ? -1 : 1;
    }
  }

  return 0;
}

function compareByNotation(a, b) {
  return naturalCompare(a?.notation, b?.notation);
}

export default class ValidateExpressionLabelsRoute extends Route {
  @service store;
  @service municipalities;
  @service provinces;

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
    description: { refreshModel: true },
    municipality: { refreshModel: true },
    province: { refreshModel: true },
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
    if (params.title && params.title.length > 3) {
      filter += `&filter[title]=${params.title}`;
    }
    if (params.description && params.description.length > 3) {
      filter += `&filter[description]=${params.description}`;
    }
    filter += this.municipalities.toMunicipalityFilter(params.municipality);
    filter += this.provinces.toProvinceFilter(params.province);

    const [annotationResult, municipalityModels, provinceModels] = await Promise.all([
      fetch(
        `/annotation-review/annotations/expression-label?page=${params.page}&pageSize=${params.size}${filter}`,
      ),
      this.municipalities.getMunicipalities(params.municipality, params.province),
      this.provinces.getProvinces(params.province),
    ]);

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
      concepts.push({
        prefLabel: 'Geen match',
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
      annotations: annotationDataWithExpressions,
      conceptSchemes,
      concepts,
      conceptSchemeId: params.conceptScheme,
      selectedConcepts,
      search: params.description,
      municipalities: municipalityModels,
      provinces: provinceModels,
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

  setupController(controller, model) {
    super.setupController(...arguments);
    controller.search = model.search;
  }
}
