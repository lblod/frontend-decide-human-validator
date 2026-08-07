import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import WorkModel from './work';

export default class ComplexWorkModel extends WorkModel {

  @hasMany('work', {
    inverse: 'isMemberOf',
    as: 'complex-work',
    async: true,
    polymorphic: true,
  })
  members;

  @hasMany('complex-work', {
    inverse: 'isPartOf',
    as: 'work',
    async: true,
    polymorphic: true,
  })
  parts;

  @hasMany('complex-work', {
    inverse: 'hasPart',
    as: 'work',
    async: true,
    polymorphic: true,
  })
  isPartOf;
}
