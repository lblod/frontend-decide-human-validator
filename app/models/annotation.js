import Model, { attr, belongsTo } from '@ember-data/model';
import { tracked } from '@glimmer/tracking';

export default class AnnotationModel extends Model {
  @attr motivatedBy;
  @attr confidence;

  @tracked renderRight = false;

  @belongsTo('specific-resource', { inverse: null, async: true }) hasTarget;
  @belongsTo('location', { inverse: null, async: true }) hasBody; // TODO: should be polymorphic to allow `dcterms:Location` and `locn:Address`
}
