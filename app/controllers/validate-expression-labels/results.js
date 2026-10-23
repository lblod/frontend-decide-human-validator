import Controller, { inject as controller } from '@ember/controller';
import { service } from '@ember/service';
import {
  buildChartRows,
  filterSummaryParts,
  percentage,
} from 'frontend-decide-human-validator/utils/validation-results';

export default class ValidateExpressionLabelsResultsController extends Controller {
  @controller('validate-expression-labels') parent;
  @service intl;

  get chartConcepts() {
    const { selectedConcepts, concepts } = this.parent.model;
    return selectedConcepts.length > 0 ? selectedConcepts : concepts;
  }

  get chartRows() {
    return buildChartRows(
      this.chartConcepts,
      this.model.rows,
      this.model.concepts,
    );
  }

  get approveTotal() {
    return this.chartRows.reduce((sum, row) => sum + row.approve, 0);
  }

  get voteTotal() {
    return this.chartRows.reduce(
      (sum, row) => sum + row.approve + row.reject,
      0,
    );
  }

  formatPercentage(value) {
    return value === null ? '–' : `${value}%`;
  }

  get reviewedPercentage() {
    const { reviewedAnnotations, annotations } = this.model.totals;
    return this.formatPercentage(percentage(reviewedAnnotations, annotations));
  }

  get approvalPercentage() {
    return this.formatPercentage(percentage(this.approveTotal, this.voteTotal));
  }

  get chartFilterSummary() {
    const { selectedConcepts, concepts } = this.parent.model;
    return filterSummaryParts(
      {
        municipalityLabel: this.parent.selectedMunicipality?.prefLabel,
        schemeLabel: this.parent.selectedConceptScheme?.prefLabel,
        year: this.parent.year,
        title: this.parent.title,
        selectedCount: selectedConcepts.length,
        conceptCount: concepts.length,
        allConcepts: selectedConcepts.length === 0,
      },
      this.intl.t.bind(this.intl),
    );
  }
}
