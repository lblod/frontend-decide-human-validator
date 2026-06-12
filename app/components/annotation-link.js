import Component from '@glimmer/component';

export default class AnnotationLink extends Component {
  get linkLink() {
    const link = this.args.annotation.link;
    if (link?.startsWith('http')) {
      return link;
    }
    return null;
  }

  get linkComment() {
    return (
      this.args.annotation.linkComment ||
      'No information found about this predicate'
    );
  }
}
