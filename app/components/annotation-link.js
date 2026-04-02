import Component from '@glimmer/component';
import { prefixes } from '../utils/prefixes';

export default class AnnotationLink extends Component {
  get linkLink() {
    const type = this.args.annotation.link;
    if (type.startsWith('http')) {
      return type;
    }
    return '#';
  }

  get linkText() {
    let link = this.args.annotation.link;
    for (const prefix in prefixes) {
      if (link.startsWith(prefixes[prefix])) {
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
