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
}
