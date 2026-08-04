import { hasMany, belongsTo, attr } from '@ember-data/model';
import AnnotationTargetModel from './annotation-target';

const MAX_SHORT_TITLE_LENGTH = 90;
export default class ExpressionModel extends AnnotationTargetModel {
  @attr('string') uri;
  @attr('language-string') title;
  @attr('string') wasDerivedFrom;
  @attr('language-string') expressionContent;

  get titleText() {
    const title = this.title?.content ? this.title.content : this.title;
    if (!title || title.trim().length === 0) {
      const content =
        this.expressionContent?.content || this.expressionContent || '';
      return '<no title> ' + content.substring(0, MAX_SHORT_TITLE_LENGTH);
    }
    return title;
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
    }).then((link) => {
      if (link?.startsWith('http://internal-files')) {
        return null;
      } else {
        return link;
      }
    });
  }

  get fallbackTitle() {
    const fallback = this.expressionContent?.content?.trim()?.substring(0, 100);
    if (fallback) {
      return `<no title:> ${fallback}...`;
    }
    return '<no title found>';
  }

  get trimmedExpressionContent() {
    let content = this.expressionContent;
    if (content?.content) {
      content = content.content;
    }
    return content?.trim();
  }
}
