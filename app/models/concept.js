import Model, { attr, belongsTo } from '@ember-data/model';

export default class ConceptModel extends Model {
  @attr('string') uri;
  @attr('language-string-set') prefLabel;
  @attr('string') notation;

  @belongsTo('concept-scheme', { inverse: null, async: true }) conceptScheme;
}
