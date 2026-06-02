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
        ['show-in-hvt']: true,
        classification:
          'http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000001',
      },
      page: {
        size: 20,
      },
      sort: 'pref-label',
    };
    const municipalities = await this.store.query('organization', orgFilter);
    const municipalitiesWithSelection = [...municipalities];
    if (params.municipality) {
      orgFilter.filter[':uri:'] = params.municipality;
      const selected = await this.store.query('organization', orgFilter);
      if (
        selected &&
        selected.length > 0 &&
        !municipalitiesWithSelection.find((m) => m.id === selected[0].id)
      ) {
        municipalitiesWithSelection.push(selected[0]);
      }
    }

    return {
      municipalities: municipalitiesWithSelection,
      apps: [
        {
          title: 'Validate SDG mapping',
          description:
            'Review how local decisions impact Sustainable Development Goals (SDGs).',
          route: 'validate-expression-labels',
          params: {
            municipality: params.municipality,
            conceptScheme: '785cfa4d-6d74-46ad-a99c-1acc176db89e',
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
            conceptScheme: undefined,
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
