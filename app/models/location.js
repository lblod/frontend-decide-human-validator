import Model, { attr, belongsTo } from '@ember-data/model';
import AnnotationBodyModel from './annotation-body';

export default class LocationModel extends AnnotationBodyModel {
  @attr('string') label;
  @attr('string') exactMatch;

  @belongsTo('geometry', { inverse: null, async: true }) geometry;
}
