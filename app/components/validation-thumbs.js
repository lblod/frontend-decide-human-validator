import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ValidationThumbs extends Component {
  @tracked approveCount = undefined;
  @tracked rejectCount = undefined;
  @tracked ownReview = undefined;

  get approvedCount() {
    if (this.approveCount !== undefined) {
      return this.approveCount;
    }
    return this.args.annotation.counts?.approve || 0;
  }
  get rejectedCount() {
    if (this.rejectCount !== undefined) {
      return this.rejectCount;
    }
    return this.args.annotation.counts?.reject || 0;
  }

  get approved() {
    if (this.ownReview !== undefined) {
      return this.ownReview === 'approve';
    }
    return this.args.annotation.counts?.ownReview === 'approve';
  }

  get rejected() {
    if (this.ownReview !== undefined) {
      return this.ownReview === 'reject';
    }
    return this.args.annotation.counts?.ownReview === 'reject';
  }

  async updateAnnotationComponentState(annotationResponse) {
    const counts = await annotationResponse.json();
    this.approveCount = counts.approve || 0;
    this.rejectCount = counts.reject || 0;
    this.ownReview = counts.ownReview;
  }

  @action
  async approve() {
    const response = await fetch(
      `/annotation-review/review/${this.args.annotation.id}/approve`,
      {
        method: 'POST',
      },
    );
    await this.updateAnnotationComponentState(response);
  }

  @action
  async reject() {
    const response = await fetch(
      `/annotation-review/review/${this.args.annotation.id}/reject`,
      {
        method: 'POST',
      },
    );
    await this.updateAnnotationComponentState(response);
  }
}
