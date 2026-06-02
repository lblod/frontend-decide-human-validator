import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class DecisionLink extends Component {
  @tracked
  showContent = false;

  @action
  openDecisionText() {
    this.showContent = true;
  }

  @action
  hideDecisionText() {
    this.showContent = false;
  }
}
