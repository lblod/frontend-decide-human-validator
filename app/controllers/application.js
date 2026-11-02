import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service intl;
  @service router;

  // NOTE (03/09/2026): The assigned value is the key of the translated string.
  // To change the string actually displayed, modify the entries in
  // the translation files.
  appTitle = 'general-app-title';

  get availableLocales() {
    return this.intl.locales;
  }

  @action
  changeLocale(locale) {
    this.intl.setLocale(locale);
    // refetch the current page so labels follow the selected language
    this.router.refresh(this.router.currentRouteName);
  }
}
