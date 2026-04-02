import Model, { attr, hasMany } from '@ember-data/model';

export default class WorkModel extends Model {
  @attr('string') uri;

  @hasMany('expression', {
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
