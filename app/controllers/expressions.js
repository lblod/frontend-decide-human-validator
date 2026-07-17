import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { service } from '@ember/service';

const SEARCH_TIMEOUT = 600;
export default class ExpressionsController extends Controller {
  queryParams = ['page', 'size', 'municipality', 'title'];
  @tracked page = 0;
  @tracked size = 20;
  @tracked title = undefined;
  @tracked search = undefined;

  @tracked municipality = null;
  @tracked predicate = null;

  @service store;
  @service municipalities;

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
    this.title = null;
    this.search = null;
  }

  @action
  searchMunicipality(term) {
    return new Promise((resolve, reject) => {
      void this.municipalities.searchMunicipalities.perform(
        term,
        resolve,
        reject,
      );
    });
  }

  searchTitle = restartableTask(async (e) => {
    await timeout(SEARCH_TIMEOUT);
    this.title = e.target.value;
  });
}
