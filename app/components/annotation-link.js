import Component from '@glimmer/component';

export default class AnnotationLink extends Component {
  get linkLink() {
    const link = this.args.annotation.link;
    if (link?.startsWith('http')) {
      return link;
    }
    return null;
  }
}
