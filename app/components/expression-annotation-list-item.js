import Component from '@glimmer/component';
import { service } from '@ember/service';
import { annotationValueLabel, isNoMatch } from '../utils/annotation-value';

export default class ExpressionAnnotationListItem extends Component {
  @service intl;

  get value() {
    return annotationValueLabel(this.args.annotation, this.intl);
  }

  get valueLink() {
    return isNoMatch(this.args.annotation) ? '#' : this.fullValue;
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
      return this.intl.t('expression-annotation-human-correction');
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
