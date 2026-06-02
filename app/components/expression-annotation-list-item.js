import Component from '@glimmer/component';

const MAX_VALUE_LENGTH = 92;

export default class ExpressionAnnotationListItem extends Component {
  get value() {
    if (
      this.args.annotation.valueText.startsWith(
        'http://mu.semte.ch/vocabularies/ext/no-match-found',
      )
    ) {
      return 'No Match';
    }
    const value = this.args.annotation.valueText;
    if (value && value.length > MAX_VALUE_LENGTH) {
      return value.substring(0, MAX_VALUE_LENGTH) + '...';
    } else {
      return value;
    }
  }

  get valueLink() {
    if (
      this.args.annotation.valueText.startsWith(
        'http://mu.semte.ch/vocabularies/ext/no-match-found',
      )
    ) {
      return '#';
    }
    return this.fullValue;
  }

  get fullValue() {
    return this.args.annotation.value;
  }

  get agentLink() {
    return this.args.annotation.agent;
  }

  get agentName() {
    return this.args.annotation.agentName || this.args.annotation.agent;
  }
}
