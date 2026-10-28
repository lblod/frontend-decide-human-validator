import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { service } from '@ember/service';
import config from 'frontend-decide-human-validator/config/environment';

export default class ExpressionsController extends Controller {
  queryParams = [
    'page',
    'size',
    'municipality',
    'predicates',
    'aimodels',
    'types',
    'title',
    'content',
  ];
  @tracked page = 0;
  @tracked size = 20;
  @tracked title = undefined;
  @tracked search = undefined;
  @tracked content = undefined;
  @tracked contentSearch = undefined;

  @tracked municipality = null;
  @tracked predicates = null;
  @tracked aimodels = null;
  @tracked types = null;

  @service store;
  @service municipalities;

  get selectedMunicipality() {
    return this.model.municipalities.find((municipality) => {
      return municipality.uri === this.municipality;
    });
  }

  get selectedPredicates() {
    return this.model.predicateOptions.filter((_option) => {
      return this.predicates?.split(',').includes(_option.key);
    });
  }

  get selectedAiModels() {
    return this.model.aiModelOptions.filter((_option) => {
      return this.aimodels?.split(',').includes(_option.key);
    });
  }

  get selectedTypes() {
    return this.model.typeOptions.filter((_option) => {
      return this.types?.split(',').includes(_option.key);
    });
  }

  @action
  changeSelectedMunicipality(municipality) {
    this.municipality = municipality.uri;
  }

  @action
  changeSelectedPredicates(_predicates) {
    this.predicates = _predicates.map((_option) => _option.key).join(',');
  }

  @action
  changeSelectedAiModels(_models) {
    this.aimodels = _models.map((_option) => _option.key).join(',');
  }

  @action
  changeSelectedTypes(_models) {
    this.types = _models.map((_option) => _option.key).join(',');
  }

  @action
  resetFilter() {
    this.municipality = null;
    this.predicates = null;
    this.aimodels = null;
    this.types = null;
    this.title = null;
    this.search = null;
    this.content = null;
    this.contentSearch = null;
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
    await timeout(config.titleSearchTimeout);
    this.title = e.target.value;
  });

  @action
  searchTitleOnEnter(e) {
    if (e.key === 'Enter') {
      this.searchTitle.cancelAll();
      this.title = e.target.value;
    }
  }

  searchContent = restartableTask(async (e) => {
    await timeout(config.titleSearchTimeout);
    this.content = e.target.value;
  });

  @action
  searchContentOnEnter(e) {
    if (e.key === 'Enter') {
      this.searchContent.cancelAll();
      this.content = e.target.value;
    }
  }
}
