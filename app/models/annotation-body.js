import Model, { hasMany } from '@ember-data/model';

export default class AnnotationBodyModel extends Model {
  @hasMany('annotation', {
    inverse: 'hasBody',
    async: true,
    polymorphic: true,
  })
  annotations;
}
