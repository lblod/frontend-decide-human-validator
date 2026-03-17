import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ValidateRoute extends Route {
  @service store;
  async model(params){
    return this.store.findRecord('expression', params.expression_id, {
      include: 'annotations,realizes,realizes.passed-by'
    });
  }
}
