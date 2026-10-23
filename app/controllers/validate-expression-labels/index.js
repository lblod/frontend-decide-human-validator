import Controller, { inject as controller } from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class ValidateExpressionLabelsIndexController extends Controller {
  @controller('validate-expression-labels') parent;

  queryParams = ['page', 'size'];
  @tracked page = 0;
  @tracked size = 20;
}
