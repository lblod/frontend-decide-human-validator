import Component from '@glimmer/component';

const MAX_VALUE_LENGTH = 92;

export default class ExpressionAnnotationListItem extends Component {
  get value() {
    if (
      this.args.annotation.valueText.startsWith(
        'http://mu.semte.ch/vocabularies/ext/no-match-found',
      )
    ) {
      return 'Geen match';
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
    return this.args.annotation.agent.startsWith('http://mu.semte.ch/sessions/')
      ? null
      : this.args.annotation.agent;
  }

  get agentName() {
    if (this.args.annotation.agent.startsWith('http://mu.semte.ch/sessions/')) {
      return 'Human correction';
    }
    return this.args.annotation.agentName || this.args.annotation.agent;
  }

  get impact() {
    let impact = this.args.annotation.impact;
    if (!impact) {
      return null;
    }
    impact = impact
      .split('http://mu.semte.ch/vocabularies/ext/impact/')
      .join('');
    return impact;
  }

  get impactText() {
    switch (this.impact) {
      case 'positive':
        return '+';
      case 'negative':
        return '-';
      case 'unknown':
      default:
        return '?';
    }
  }
  get impactSkin() {
    switch (this.impact) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      case 'unknown':
      default:
        return 'warning';
    }
  }
}
