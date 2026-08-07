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
    inverse: 'hasMember',
    as: 'work',
    async: true,
  })
  isPartOf;
}
