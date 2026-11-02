import Route from '@ember/routing/route';

export default class ValidateExpressionLabelsResultsRoute extends Route {
  async model() {
    const { filter, conceptSchemeId } = this.modelFor(
      'validate-expression-labels',
    );
    if (!conceptSchemeId) {
      return null;
    }
    const response = await fetch(
      `/annotation-review/review-summary/expression-label?${filter}`,
    );
    return response.json();
  }
}
