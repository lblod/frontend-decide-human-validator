import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ValidateController extends Controller {
  queryParams = ['page', 'size'];
  @tracked page = 0;
  @tracked size = 8;

  @tracked selectedAnnotation = null;

  @action
  selectAnnotation(annotation) {
    this.selectedAnnotation = annotation;
  }
}
