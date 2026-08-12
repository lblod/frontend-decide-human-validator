import Model, { hasMany } from '@ember-data/model';

export default class AnnotationTargetModel extends Model {
  @hasMany('annotation', { inverse: 'hasTarget', as: 'annotation-target', async: true, polymorphic: true })
  annotations;
}
