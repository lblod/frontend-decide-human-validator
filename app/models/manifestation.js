import Model, { attr } from '@ember-data/model';

export default class ManifestationModel extends Model {
  @attr('string') label;
  @attr('date') issued;
  @attr('date') modified;
  @attr('string') web;
  @attr('string') isExemplifiedBy;
}
