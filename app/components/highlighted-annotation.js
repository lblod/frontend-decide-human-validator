import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class HighlightedAnnotation extends Component {
  @tracked
  showInfo = false;

  get icon() {
    return 'eye';
  }

  get showNoUriWarning() {
    return !this.args.annotation.type.startsWith(
      'http://www.w3.org/2001/XMLSchema#',
    );
  }

  @action
  resetShowInfo() {
    this.showInfo = false;
  }

  @action
  toggleShowInfo(event) {
    if (event.target.classList.contains('highlighted-annotation')) {
      this.showInfo = !this.showInfo;
    }
  }
}
