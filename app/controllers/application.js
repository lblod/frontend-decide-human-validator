import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service intl;

  // NOTE (03/09/2026): The assigned value is the key of the translated string.
  // To change the string actually displayed, modify the entries in
  // the translation files.
  appTitle = 'general-app-title';
}
