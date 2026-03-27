import Model, { attr } from '@ember-data/model';

export default class TextPositionSelectorModel extends Model {
  @attr('number') start;
  @attr('number') end;
}
