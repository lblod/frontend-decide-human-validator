import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ValidateController extends Controller {
  queryParams = [
    'page',
    'size',
    'hideVoted',
    'predicates',
    'aimodels',
    'types',
  ];
  @tracked page = 0;
  @tracked size = 20;
  @tracked hideVoted = true;

  @tracked predicates = null;
  @tracked aimodels = null;
  @tracked types = null;

  @tracked selectedAnnotation = null;

  @action
  selectAnnotation(annotation) {
    this.selectedAnnotation = annotation;
    const scrollAnnotationIntoView = () => {
      setTimeout(() => {
        const element = document.getElementsByClassName(
          'highlighted-annotation',
        )?.[0];
        if (element?.scrollIntoView && element?.checkVisibility()) {
          element.scrollIntoView({ block: 'center' });
        }
      }, 10);
    };
    const observer = new MutationObserver(() => {
      scrollAnnotationIntoView();
    });
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    scrollAnnotationIntoView();
    // wait 1s for dom to settle and give up on scrolling after that
    setTimeout(() => observer.disconnect(), 1000);
  }

  @action
  toggleHideVoted() {
    this.hideVoted = !this.hideVoted;
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
    this.predicates = null;
    this.aimodels = null;
    this.types = null;
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
}
