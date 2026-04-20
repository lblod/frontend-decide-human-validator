import Model, { hasMany, belongsTo, attr } from '@ember-data/model';

const MAX_SHORT_TITLE_LENGTH = 90;
export default class ExpressionModel extends Model {
  @attr('string') uri;
  @attr('language-string') title;
  @attr('string') wasDerivedFrom;
  @attr('language-string') expressionContent;

  get titleText() {
    return this.title?.content ? this.title.content : this.title;
  }

  get shortenedTitleText() {
    const title = this.titleText || '';
    const shortened = title.substring(0, MAX_SHORT_TITLE_LENGTH).trim();
    return shortened.length < title.length ? `${shortened}...` : shortened;
  }

  @hasMany('manifestation', {
    inverse: null,
    async: true,
  })
  isEmbodiedBy;

  @hasMany('specific-resource', {
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
