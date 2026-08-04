import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { service } from '@ember/service';

const SEARCH_TIMEOUT = 600;

export default class ValidateExpressionLabelsController extends Controller {
  queryParams = [
    'page',
    'size',
    'concepts',
    'conceptScheme',
    'showImpact',
    'showCs',
    'impact',
    'year',
    'dsAll',
    'hideVoted',
    'title',
    'description',
    'municipality',
  ];
  @tracked page = 0;
  @tracked size = 20;
  @tracked concepts = undefined;
  @tracked conceptScheme = undefined;
  @tracked showImpact = false;
  @tracked impact = undefined;
  @tracked showCs = true;
  @tracked year = undefined;
  @tracked dsAll = false;
  @tracked hideVoted = true;
  @tracked title = undefined;
  @tracked description = undefined;
  @tracked search = undefined;
  @tracked municipality = null;

  @service store;
  @service municipalities;

  yearOptions = [
    { label: 'Any', value: undefined },
    { label: '2026', value: '2026' },
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
    { label: '2023', value: '2023' },
    { label: '2022', value: '2022' },
    { label: '2021', value: '2021' },
    { label: '2020', value: '2020' },
  ];

  impactOptions = [
    {
      value: '0e432b1b-87ad-4c32-9fc5-b151dd49f60d',
      label: 'Positive',
    },
    {
      value: '1e122909-a685-4c0f-8b61-d639173b0a58',
      label: 'Negative',
    },
    { value: undefined, label: 'Any' },
  ];

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
  searchMunicipality(term) {
    return new Promise((resolve, reject) => {
      void this.municipalities.searchMunicipalities.perform(
        term,
        resolve,
        reject,
      );
    });
  }

  get selectedConceptScheme() {
    return this.model.conceptSchemes.find((scheme) => {
      return scheme.id === this.conceptScheme;
    });
  }

  get selectedYear() {
    return this.yearOptions.find((year) => {
      return year.value === this.year;
    });
  }

  get canDeselectAllConcepts() {
    return this.model.concepts?.length > 1 && !this.dsAll;
  }

  get canSelectAllConcepts() {
    return (
      this.dsAll &&
      this.model.concepts?.length > 0 &&
      this.model.selectedConcepts.length === 0
    );
  }

  isSelected(selectedConcepts, concept) {
    return selectedConcepts.includes(concept);
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
    await timeout(SEARCH_TIMEOUT);
    this.store
      .query('concept-scheme', {
        filter: {
          ['pref-label']: term,
          ['show-in-hvt']: true,
        },
        page: {
          size: 20,
        },
      })
      .then((result) => resolve(result), reject);
  });

  @action
  toggleConcept(concept) {
    if (!this.concepts && !this.dsAll) {
      setTimeout(() => {
        this.dsAll = false;
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
      this.dsAll = false;
      this.concepts = selectedConcepts.filter((id) => !!id).join(',');
    });
  }

  @action
  changeImpact(impact) {
    this.impact = impact;
  }

  @action
  changeYear(year) {
    this.year = year.value;
  }

  @action
  deselectAllConcepts() {
    this.dsAll = true;
    this.concepts = [];
  }

  @action
  selectAllConcepts() {
    this.dsAll = false;
    this.concepts = [];
  }

  @action
  resetFilters() {
    this.concepts = null;
    if (this.showCs) {
      this.conceptScheme = null;
    }
    this.impact = undefined;
    this.year = undefined;
    this.dsAll = false;
    this.search = undefined;
    this.title = undefined;
    this.description = undefined;
  }

  @action
  toggleHideVoted() {
    this.hideVoted = !this.hideVoted;
  }

  searchTitle = restartableTask(async (e) => {
    await timeout(SEARCH_TIMEOUT);
    this.title = e.target.value;
  });

  searchDescription = restartableTask(async (e) => {
    await timeout(SEARCH_TIMEOUT);
    this.description = e.target.value;
  });
}
