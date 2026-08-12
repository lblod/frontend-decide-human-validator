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
          title: 'Valideer VAP linking',
          description:
            'Valideer de gegenereerde links tussen lokale actieplannen en het Vlaams Klimaatadaptatieplan (VAP) voor 2030.',
          route: 'validate-expression-labels',
          params: {
            owner: params.municipality,
            conceptScheme: '6673ad10-0f68-5e7d-81b1-c74828de3879',
            showImpact: false,
            showCs: false,
          },
        },
      ],
    };
  }
}
