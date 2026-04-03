import Component from '@glimmer/component';

export default class AnnotationLocation extends Component {
  get content() {
    if (typeof this.args.expression.expressionContent === 'string') {
      return this.args.expression.expressionContent;
    } else {
      return this.args.expression.expressionContent?.content;
    }
  }
  get expressionContentBefore() {
    if (!this.args.location) {
      return this.content;
    }
    return this.content.substring(0, this.args.location.start);
  }

  get expressionContentAt() {
    if (!this.args.location) {
      return null;
    }
    return this.content
      .substring(this.args.location.start, this.args.location.end)
      .trim();
  }

  get expressionContentAfter() {
    if (!this.args.location) {
      return null;
    }
    return this.content.substring(this.args.location.end);
  }
}
