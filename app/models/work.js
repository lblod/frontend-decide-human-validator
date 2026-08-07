import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class WorkModel extends Model {
  @attr('string') uri;
  @attr('string') title;
  @attr('date') dateDocument;
  @attr('string') workType;

  @hasMany('expression', {
    inverse: 'realizes',
    as: 'work',
    async: true,
    polymorphic: true,
  })
  isRealizedBy;

  @hasMany('organization', {
    inverse: null,
    async: true,
  })
  passedBy;

  @hasMany('complex-work', {
    inverse: 'members',
    as: 'work',
    async: true,
  })
  isMemberOf;

  @hasMany('complex-work', {
    inverse: 'parts',
    as: 'work',
    async: true,
  })
  isPartOf;
}
