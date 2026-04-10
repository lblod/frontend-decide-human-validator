import Component from '@glimmer/component';
import { prefixes } from '../utils/prefixes';

export default class AnnotationLink extends Component {
  get linkLink() {
    const link = this.args.annotation.link;
    if (link?.startsWith('http')) {
      return link;
    }
    return null;
  }

  get linkText() {
    let link = this.args.annotation.link;
    for (const prefix in prefixes) {
      if (link?.startsWith(prefixes[prefix])) {
        if (prefix === 'xsd') {
          link = link.replace(prefixes[prefix], '');
        } else {
          link = link.replace(prefixes[prefix], prefix + ':');
        }

        break;
      }
    }
    return link;
  }
}
