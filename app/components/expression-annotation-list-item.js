import Component from '@glimmer/component';

const MAX_VALUE_LENGTH = 92;

export default class ExpressionAnnotationListItem extends Component {
  get value() {
    const value = this.args.annotation.valueText;
    if (value && value.length > MAX_VALUE_LENGTH) {
      return value.substring(0, MAX_VALUE_LENGTH) + '...';
    } else {
      return value;
    }
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
