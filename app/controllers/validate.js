import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ValidateController extends Controller {
  queryParams = ['page', 'size', 'hideVoted'];
  @tracked page = 0;
  @tracked size = 8;
  @tracked hideVoted = true;

  @tracked selectedAnnotation = null;

  @action
  selectAnnotation(annotation) {
    this.selectedAnnotation = annotation;
    setTimeout(() => {
      const element = document.getElementsByClassName(
        'highlighted-annotation',
      )?.[0];
      if (element?.scrollIntoView) {
        element.scrollIntoView({ block: 'center' });
      }
    }, 100);
  }

  @action
  toggleHideVoted() {
    this.hideVoted = !this.hideVoted;
  }
}
