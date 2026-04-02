import Component from '@glimmer/component';
import { prefixes } from '../utils/prefixes';

export default class AnnotationType extends Component {
  get typeLink() {
    const type = this.args.annotation.type;
    if (type.startsWith('http')) {
      return type;
    }
    return '#';
  }

  get typeText() {
    let type = this.args.annotation.type;
    for (const prefix in prefixes) {
      if (type.startsWith(prefixes[prefix])) {
        if (prefix === 'xsd') {
          type = type.replace(prefixes[prefix], '');
        } else {
          type = type.replace(prefixes[prefix], prefix + ':');
        }
        break;
      }
    }
    return type;
  }
}
