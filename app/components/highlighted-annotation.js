import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
export default class HighlightedAnnotation extends Component {
  @service store;

  @tracked
  showInfo = false;
  @tracked geometry = null;

  get icon() {
    return 'eye';
  }

  get showNoUriWarning() {
    return !this.args.annotation.type?.startsWith(
      'http://www.w3.org/2001/XMLSchema#',
    );
  }

  @action
  async resetShowInfo() {
    this.showInfo = false;
    if (this.args.annotation.type === 'http://purl.org/dc/terms/Location') {
      const locations = await this.store.query('location', {
        'filter[:uri:]': this.args.annotation.value,
        include: 'geometry',
      });
      if (locations.length < 1) {
        this.geometry = null;
      } else {
        this.geometry = await locations[0].geometry;
      }
    } else {
      this.geometry = null;
    }
  }

  @action
  toggleShowInfo(event) {
    let maybeButton = event.target;
    while (
      maybeButton &&
      !maybeButton.classList.contains('highlighted-annotation') &&
      !maybeButton.classList.contains('highlight-info')
    ) {
      maybeButton = maybeButton.parentElement;
    }
    if (maybeButton?.classList.contains('highlighted-annotation')) {
      this.showInfo = !this.showInfo;
    }
  }
}
