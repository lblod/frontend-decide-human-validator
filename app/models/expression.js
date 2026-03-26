import Model, { hasMany, belongsTo, attr } from '@ember-data/model';

export default class ExpressionModel extends Model {
  @attr('string') uri;
  @attr('language-string') title;
  @attr('string') wasDerivedFrom;
  @attr('language-string') expressionContent;

  @hasMany('manifestation', {
    inverse: null,
    async: true,
  })
  isEmbodiedBy;

  @hasMany('SpecificResource', {
    inverse: null,
    async: true,
  })
  isSourceOf;

  @belongsTo('work', {
    inverse: null,
    async: true,
  })
  realizes;

  get accessLink() {
    return new Promise((resolve) => {
      this.isEmbodiedBy.then((manifestations) => {
        const firstManifestation = manifestations?.[0];
        if (firstManifestation) {
          resolve(firstManifestation.isExemplifiedBy);
        } else {
          resolve(this.wasDerivedFrom);
        }
      });
    });
  }
}
