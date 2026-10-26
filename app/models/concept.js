import Model, { attr, belongsTo } from '@ember-data/model';
import { service } from '@ember/service';

export default class ConceptModel extends Model {
  @service intl;

  @attr('string') uri;
  @attr('language-string-set') prefLabel;
  @attr('string') notation;

  @belongsTo('concept-scheme', { inverse: null, async: true }) conceptScheme;

  // selected language, untagged, en, other
  get label() {
    const labels = this.prefLabel ?? [];
    const language = this.intl.primaryLocale.split('-')[0];
    const matches = (label, wanted) => {
      const tag = (label.language ?? '').toLowerCase();
      return tag === wanted || tag.startsWith(`${wanted}-`);
    };
    const match =
      labels.find((label) => matches(label, language)) ??
      labels.find((label) => !label.language) ??
      labels.find((label) => matches(label, 'en')) ??
      labels[0];
    return match?.content ?? '';
  }
}
