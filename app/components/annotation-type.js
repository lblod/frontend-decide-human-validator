import Component from '@glimmer/component';
import { prefixes } from '../utils/prefixes';

export default class AnnotationType extends Component {
  get typeLink() {
    const type = this.args.annotation.type;
    if (!type) {
      return 'https://www.w3.org/2001/09/rdfprimer/section2.html#uri';
    }
    if (type.startsWith('http')) {
      return type;
    }
    return '#';
  }

  get typeText() {
    let type = this.args.annotation.type;
    if (!type) {
      return 'URI';
    }
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

  get typeComment() {
    return (
      this.args.annotation.typeComment || 'No information found about this type'
    );
  }

  get exampleText() {
    let type = this.args.annotation.type;

    const example = {
      'http://www.w3.org/2001/XMLSchema#date':
        'YYYY-MM-DD for example 2026-02-25',
    }[type];

    if (!example) {
      return null;
    }

    return `Value must be in the format of ${example}`;
  }
}
