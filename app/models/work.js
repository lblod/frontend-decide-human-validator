import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class WorkModel extends Model {
  @attr('string') uri;

  @belongsTo('expression', {
    inverse: null,
    async: true,
  })
  isRealizedBy;

  @hasMany('organization', {
    inverse: null,
    async: true,
  })
  passedBy;
}
