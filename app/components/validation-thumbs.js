import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class ValidationThumbs extends Component {
  @service store;

  @tracked approveCount = undefined;
  @tracked rejectCount = undefined;
  @tracked ownReview = undefined;
  @tracked modalOpen = false;
  @tracked selectedConcept = null;

  get concepts() {
    const filter = {};
    if (this.args.conceptSchemeId) {
      filter['concept-scheme'] = { id: this.args.conceptSchemeId };
    }
    return this.store.query('concept', {
      filter,
      page: {
        size: 999, // assume concept schemes are smaller than 999 concepts so we don't have to get fancy with the search function
      },
    });
  }

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

  get canCorrect() {
    return this.args.allowCorrection;
  }

  async updateAnnotationComponentState(annotationResponse) {
    const { counts, correctionId } = await annotationResponse.json();
    this.approveCount = counts.approve || 0;
    this.rejectCount = counts.reject || 0;
    this.ownReview = counts.ownReview || false;
  }

  async rejectAnnotation() {
    let response;
    const body = {
      correction: null,
    };
    if (this.selectedConcept) {
      body.correction = {
        resourceUri: this.selectedConcept.uri,
        // also possible by API but not in current frontend:
        // statement: {
        //   subject:
        //     'http://data.lblod.gift/id/concept/c7c2f6a3bc20fef280dd77a408af5412',
        //   predicate:
        //     'http://data.lblod.gift/id/concept/c7c2f6a3bc20fef280dd77a408af5412',
        //   object: 'yes',
        //   type: 'text',
        // },
      };
    }
    response = await fetch(
      `/annotation-review/review/${this.args.annotation.id}/reject`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );
    await this.updateAnnotationComponentState(response);
  }

  @action
  async approve() {
    let response;
    if (this.approved) {
      response = await fetch(
        `/annotation-review/review/${this.args.annotation.id}`,
        {
          method: 'DELETE',
        },
      );
    } else {
      response = await fetch(
        `/annotation-review/review/${this.args.annotation.id}/approve`,
        {
          method: 'POST',
        },
      );
    }
    await this.updateAnnotationComponentState(response);
  }

  @action
  async reject() {
    if (this.rejected) {
      const response = await fetch(
        `/annotation-review/review/${this.args.annotation.id}`,
        {
          method: 'DELETE',
        },
      );
      await this.updateAnnotationComponentState(response);
      return;
    }
    if (this.canCorrect) {
      this.modalOpen = true;
      this.selectedConcept = null;
    } else {
      await this.confirmReject();
    }
  }

  @action
  async confirmReject() {
    await this.rejectAnnotation();
    this.modalOpen = false;
  }
  @action
  async cancelReject() {
    this.modalOpen = false;
  }

  @action
  changeConcept(concept) {
    this.selectedConcept = concept;
  }
}
