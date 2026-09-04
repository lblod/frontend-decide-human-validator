import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service intl;

  beforeModel() {
    this.#setupIntl();
  }

  #setupIntl() {
    this.intl.setLocale(['en-us', 'nl-be']);
  }
}
