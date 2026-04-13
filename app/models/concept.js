import Model, { attr, belongsTo } from '@ember-data/model';

export default class ConceptModel extends Model {
  @attr('string') uri;
  @attr('string') prefLabel;

  @belongsTo('concept-scheme', { inverse: null, async: true }) conceptScheme;
}
