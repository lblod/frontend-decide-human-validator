import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { service } from '@ember/service';

export default class ValidateExpressionLabelsController extends Controller {
  queryParams = ['page', 'size', 'concepts', 'conceptScheme', 'owner'];
  @tracked page = 0;
  @tracked size = 8;
  @tracked concepts = undefined;
  @tracked conceptScheme = undefined;
  @tracked owner = undefined;
  @service store;

  get selectedConceptScheme() {
    return this.model.conceptSchemes.find((scheme) => {
      return scheme.id === this.conceptScheme;
    });
  }
  @action
  isSelected(concept) {
    return this.model.selectedConcepts.includes(concept);
  }

  @action
  changeSelectedConceptScheme(scheme) {
    this.conceptScheme = scheme.id;
  }
  @action
  searchConceptScheme(term) {
    return new Promise((resolve, reject) => {
      void this._performSearch.perform(term, resolve, reject);
    });
  }

  _performSearch = restartableTask(async (term, resolve, reject) => {
    await timeout(600);
    this.store
      .query('concept-scheme', {
        filter: {
          ['pref-label']: term,
        },
        page: {
          size: 20,
        },
      })
      .then((result) => resolve(result), reject);
  });

  @action
  toggleConcept(concept) {
    if (!this.concepts) {
      setTimeout(() => {
        this.concepts = this.model.concepts
          .map((concept) => concept.id)
          .filter((id) => id != concept.id)
          .join(',');
      });
      return;
    }
    let selectedConcepts = (this.concepts || '').split(',');

    if (selectedConcepts.includes(concept.id)) {
      selectedConcepts = selectedConcepts.filter((id) => {
        return id != concept.id;
      });
    } else {
      selectedConcepts.push(concept.id);
    }
    setTimeout(() => {
      this.concepts = selectedConcepts.filter((id) => !!id).join(',');
    });
  }

  @action
  resetFilter() {
    this.concepts = null;
    this.conceptScheme = null;
  }
}
