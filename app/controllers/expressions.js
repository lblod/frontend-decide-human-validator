import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class ExpressionsController extends Controller {
  queryParams = ['page', 'size', 'selectedMunicipalityUri'];
  @tracked page = 0;
  @tracked size = 20;

  @tracked selectedMunicipalityUri = null;

  get selectedMunicipality() {
    return this.model.municipalities.find((municipality) => {
      return municipality.uri === this.selectedMunicipalityUri;
    });
  }

  @action
  changeSelectedMunicipality(municipality) {
    this.selectedMunicipalityUri = municipality.uri;
  }

  @action
  resetFilter() {
    this.selectedMunicipalityUri = null;
  }
}
