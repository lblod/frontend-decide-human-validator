import Model, { attr, belongsTo } from '@ember-data/model';
import { service } from '@ember/service';
import stringForLocale from '../helpers/locale-language-string';

export default class ConceptModel extends Model {
  @service intl;
  @attr('string') uri;
  @attr('language-string-set') prefLabel;
  @attr('string') notation;

  @belongsTo('concept-scheme', { inverse: null, async: true }) conceptScheme;

  get label() {
    const labels = this.prefLabel ?? [];
    return (
      stringForLocale(labels, this.intl.primaryLocale) ??
      labels[0]?.content ??
      ''
    );
  }

  get displayLabel() {
    return this.notation ? `${this.notation}: ${this.label}` : this.label;
  }
}
