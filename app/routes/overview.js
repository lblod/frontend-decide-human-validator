import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class OverviewRoute extends Route {
  @service store;

  queryParams = {
    municipality: { refreshModel: true },
  };

  async model(params) {
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
    if (params.municipality) {
      orgFilter.filter[':uri:'] = params.municipality;
    }

    return {
      municipalities: await this.store.query('organization', orgFilter),
      apps: [
        {
          title: 'Validate SDG mapping',
          description:
            'Review how local decisions impact Sustainable Development Goals (SDGs).',
          route: 'validate-expression-labels',
          params: {
            owner: params.municipality,
            conceptScheme: '249ab17a-fddd-46a6-a80e-d8cfc49d9339',
            showImpact: true,
            showCs: false,
          },
        },
        {
          title: 'Validate codelist mapping',
          description:
            'Review how local decisions are mapped to predefined codelist concepts.',
          route: 'validate-expression-labels',
          params: {
            owner: params.municipality,
            showImpact: false,
            showCs: true,
          },
        },
        {
          title: 'Validate text annotations',
          description:
            'Review the annotations identified in the text of local decisions, such as dates, locations, or mandatary roles.',
          route: 'expressions',
          params: {
            municipality: params.municipality,
          },
        },
      ],
    };
  }
}
