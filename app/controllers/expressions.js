import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { service } from '@ember/service';
export default class ExpressionsController extends Controller {
  queryParams = ['page', 'size', 'municipality'];
  @tracked page = 0;
  @tracked size = 20;

  @tracked municipality = null;

  @service store;

  get selectedMunicipality() {
    return this.model.municipalities.find((municipality) => {
      return municipality.uri === this.municipality;
    });
  }

  @action
  changeSelectedMunicipality(municipality) {
    this.municipality = municipality.uri;
  }

  @action
  resetFilter() {
    this.municipality = null;
  }

  @action
  searchMunicipality(term) {
    return new Promise((resolve, reject) => {
      void this._performSearch.perform(term, resolve, reject);
    });
  }

  _performSearch = restartableTask(async (term, resolve, reject) => {
    await timeout(600);
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
      .then((result) => resolve(result), reject);
  });
}
