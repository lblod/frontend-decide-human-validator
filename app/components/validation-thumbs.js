import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ValidationThumbs extends Component {
  // TODO stubbed, to be done in separate story
  get approvedCount() {
    return 10;
  }
  get rejectedCount() {
    return 12;
  }

  get approved() {
    return true;
  }

  get rejected() {
    return false;
  }

  @action
  approve() {
    console.log('todo approve');
  }

  @action
  reject() {
    console.log('todo reject');
  }
}
