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
          title: 'Validate Decision SDGs',
          description:
            'Validate which Sustainable Development Goals are impacted (positively or negatively) by which decisions in the municipality',
          route: 'validate-expression-labels',
          params: {
            owner: params.municipality,
            conceptScheme: '249ab17a-fddd-46a6-a80e-d8cfc49d9339',
            showImpact: true,
            showCs: false,
          },
        },
        {
          title: 'Validate Decision Codelist mapping',
          description:
            'Validate by which decisions in the municipality relate to arbitrary codelist concepts.',
          route: 'validate-expression-labels',
          params: {
            owner: params.municipality,
          },
        },
        {
          title: 'Validate Decision Contents',
          description:
            'Validate the enrichments our AI agents found in the contents of the decisions of the selected municipality.',
          route: 'expressions',
          params: {
            municipality: params.municipality,
          },
        },
      ],
    };
  }
}
