import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class ValidateController extends Controller {
  queryParams = ['page', 'size'];
  @tracked page = 0;
  @tracked size = 8;
}
