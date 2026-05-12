import Model, { hasMany } from '@ember-data/model';

export default class AnnotationBodyModel extends Model {
  @hasMany('annotation', { inverse: 'hasTarget', async: true, polymorphic: true }) annotations;
}
