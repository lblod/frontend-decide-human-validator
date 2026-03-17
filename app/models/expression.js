import Model, { hasMany, belongsTo, attr } from '@ember-data/model';

export default class ExpressionModel extends Model {
  @attr('string') uri;
  @attr('language-string') title;
  @attr('string') wasDerivedFrom;

  @hasMany('manifestation', {
    inverse: null,
    async: true,
  })
  isEmbodiedBy;

  @hasMany('annotation', {
    inverse: null,
    async: true,
  })
  annotations;

  @belongsTo('work', {
    inverse: null,
    async: true,
  })
  realizes;

  get accessLink() {
    return new Promise(async (resolve) => {
      const manifestations = await this.isEmbodiedBy;
      const firstManifestation = manifestations?.[0];
      if(firstManifestation){
        resolve(firstManifestation.isExemplifiedBy);
      }else{
        resolve(this.wasDerivedFrom);
      }
    });
  }
}
