import { belongsTo } from '@ember-data/model';
import AnnotationTargetModel from './annotation-target';

export default class SpecificResourceModel extends AnnotationTargetModel {
  @belongsTo('expression', { inverse: null, async: true }) source; // TODO: probably needs to be polymorphic
  @belongsTo('text-position-selector', { inverse: null, async: true }) selector;
}
