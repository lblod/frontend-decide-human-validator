import Model, { attr, belongsTo } from '@ember-data/model';
import { tracked } from '@glimmer/tracking';

export default class AnnotationModel extends Model {
  @attr motivatedBy;
  @attr confidence;
  @tracked renderRight = false;

  @belongsTo('annotation-target', { inverse: null, async: true, polymorphic: true }) hasTarget;
  @belongsTo('annotation-body', { inverse: null, async: true, polymorphic: true }) hasBody;

}
