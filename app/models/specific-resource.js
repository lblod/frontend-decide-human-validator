import Model, { belongsTo } from '@ember-data/model';

export default class SpecificResourceModel extends Model {
  @belongsTo('expression', { inverse: null, async: true }) source; // TODO: probably needs to be polymorphic
  @belongsTo('text-position-selector', { inverse: null, async: true }) selector;
}
