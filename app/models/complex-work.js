import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import WorkModel from './work';

export default class ComplexWorkModel extends WorkModel {

  @hasMany('work', {
    inverse: 'isPartOf',
    as: 'complex-work',
    async: true,
    polymorphic: true,
  })
  hasMember;

  @hasMany('complex-work', {
    inverse: 'hasMember',
    as: 'complex-work',
    async: true,
    polymorphic: true,
  })
  isPartOf;
}
