import Model, { hasMany } from '@ember-data/model';

export default class AnnotationTargetModel extends Model {
  @hasMany('annotation', { inverse: null, async: true, polymorphic: true })
  annotations;
}
