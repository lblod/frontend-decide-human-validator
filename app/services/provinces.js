import Service from '@ember/service';
import { service } from '@ember/service';
import { restartableTask, timeout } from 'ember-concurrency';
const SEARCH_TIMEOUT = 600;

export default class ProvincesService extends Service {
  orgFilter = {
    filter: {
      classification:
        'http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000000', //provincie
    },
    page: {
      size: 20,
    },
    sort: 'pref-label',
  };

  @service store;
  async getProvinces(selectedUri) {
    const provinceModels = await this.store.query(
      'organization',
      this.orgFilter,
    );
    const provincesWithSelection = [...provinceModels];
    const orgFilter = JSON.parse(JSON.stringify(this.orgFilter));

    if (selectedUri) {
      orgFilter.filter[':uri:'] = selectedUri;
      const selected = this.store.query('organization', orgFilter);
      if (
        selected &&
        selected[0] &&
        !provincesWithSelection.find((m) => m.id === selected[0].id)
      ) {
        provincesWithSelection.push(selected);
      }
    }
    return [...provincesWithSelection];
  }

  searchProvinces = restartableTask(async (term, resolve, reject) => {
    await timeout(SEARCH_TIMEOUT);
    this.store
      .query('organization', {
        filter: {
          ['pref-label']: term,
          classification:
            'http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000000',
        },
        page: {
          size: 20,
        },
      })
      .then((result) => {
        const res = [...result];
        resolve(res);
      }, reject);
  });

  toProvinceFilter(provinceUri) {
    if (provinceUri) {
      return `&filter[province]=${encodeURIComponent(provinceUri)}`;
    } else {
      return '';
    }
  }
}
