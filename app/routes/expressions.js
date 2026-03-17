import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ExpressionsRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
  };

  async model(params) {
    return this.store.query('expression', {
      include: 'realizes,realizes.passed-by',
      'filter[:has:realizes]': true,
      'filter[:has:annotations]': true,
      page: { size:params.size, number: params.page },
    });
  }
}
