import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class ValidateExpressionLabelsController extends Controller {
  queryParams = ['page', 'size'];
  @tracked page = 0;
  @tracked size = 8;
}
