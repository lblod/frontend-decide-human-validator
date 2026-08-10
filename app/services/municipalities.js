import Service from '@ember/service';
import { service } from '@ember/service';
import { restartableTask, timeout } from 'ember-concurrency';
const SEARCH_TIMEOUT = 600;

export default class MunicipalitiesService extends Service {
  orgFilter = {
    filter: {
      // ['show-in-hvt']: true,
      classification:
        'http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000001',
    },
    page: {
      size: 20,
    },
    sort: 'pref-label',
  };

  other = { prefLabel: 'Other', id: 'other', uri: 'other' };

  @service store;
  async getMunicipalities(selectedUri) {
    const municipalityModels = await this.store.query(
      'organization',
      this.orgFilter,
    );
    const municipalitiesWithSelection = [...municipalityModels];
    const orgFilter = JSON.parse(JSON.stringify(this.orgFilter));

    if (selectedUri) {
      orgFilter.filter[':uri:'] = selectedUri;
      const selected = this.store.query('organization', orgFilter);
      if (
        selected &&
        selected[0] &&
        !municipalitiesWithSelection.find((m) => m.id === selected[0].id)
      ) {
        municipalitiesWithSelection.push(selected);
      }
    }
    return [...municipalitiesWithSelection, this.other];
  }

  searchMunicipalities = restartableTask(async (term, resolve, reject) => {
    await timeout(SEARCH_TIMEOUT);
    this.store
      .query('organization', {
        filter: {
          ['pref-label']: term,
          ['show-in-hvt']: true,
          classification:
            'http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000001',
        },
        page: {
          size: 20,
        },
      })
      .then((result) => {
        const res = [...result];
        if (this.other.prefLabel.toLowerCase().startsWith(term.toLowerCase())) {
          res.push(this.other);
        }
        resolve(res);
      }, reject);
  });

  toMunicipalityFilter(municipalityUri) {
    if (municipalityUri === this.other.uri) {
      return `&filter[otherMunicipality]=true`;
    } else if (municipalityUri) {
      return `&filter[municipality]=${encodeURIComponent(municipalityUri)}`;
    } else {
      return '';
    }
  }
}
