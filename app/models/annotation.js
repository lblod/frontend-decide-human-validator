import Model, { attr, belongsTo } from '@ember-data/model';

export default class AnnotationModel extends Model {
  @attr motivatedBy;
  @attr confidence;

  @belongsTo('annotation-target', { inverse: null, async: true, polymorphic: true }) hasTarget;
  @belongsTo('annotation-body', { inverse: null, async: true, polymorphic: true }) hasBody;
}
