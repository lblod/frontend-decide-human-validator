import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import EmberObject from '@ember/object';

export default class ValidationThumbs extends Component {
  @service store;

  @tracked approveCount = undefined;
  @tracked rejectCount = undefined;
  @tracked ownReview = undefined;
  @tracked modalOpen = false;
  @tracked corrections = [];

  async loadConcepts() {
    const filter = {};
    if (this.args.conceptSchemeId) {
      filter['concept-scheme'] = { id: this.args.conceptSchemeId };
    }
    let concepts = await this.store.query('concept', {
      filter,
      page: {
        size: 999, // assume concept schemes are smaller than 999 concepts so we don't have to get fancy with the search function
      },
    });
    for (const concept of concepts) {
      if (concept.notation && concept.prefLabel?.length) {
        concept.prefLabel = concept.prefLabel.map(
          (label) => `${concept.notation}: ${label}`
        );
      }
    }
    return concepts;
  }

  get concepts() {
    return this.loadConcepts();
  }
  get impacts() {
    return [
      {
        prefLabel: 'Positive',
        uri: 'http://mu.semte.ch/vocabularies/ext/impact/positive',
      },
      {
        prefLabel: 'Negative',
        uri: 'http://mu.semte.ch/vocabularies/ext/impact/negative',
      },
      {
        prefLabel: 'Neutral',
        uri: 'http://mu.semte.ch/vocabularies/ext/impact/neutral',
      },
    ];
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

  get hasDuplicateCorrection() {
    const correctionsSeen = new Set();
    let duplicate = false;
    this.corrections.forEach((correction) => {
      if (correctionsSeen.has(correction.concept)) {
        duplicate = true;
      } else {
        correctionsSeen.add(correction.concept);
      }
    });

    return duplicate;
  }

  async updateAnnotationComponentState(annotationResponse) {
    const { counts, correctionId: _correctionId } =
      await annotationResponse.json();
    this.approveCount = counts.approve || 0;
    this.rejectCount = counts.reject || 0;
    this.ownReview = counts.ownReview || false;
  }

  async rejectAnnotation() {
    let response;
    const body = {
      corrections: null,
    };
    if (this.corrections && this.corrections.length > 0) {
      body.corrections = this.corrections
        .filter((correction) => {
          return !!correction.concept;
        })
        .map((correction) => {
          return {
            resourceUris: [
              correction.concept.uri,
              correction.impact?.uri,
            ].filter((r) => !!r),
          };
        });
      // also possible by API but not in current frontend:
      // [{statement: {
      //   subject:
      //     'http://lblod.data.gift/id/concept/c7c2f6a3bc20fef280dd77a408af5412',
      //   predicate:
      //     'http://lblod.data.gift/id/concept/c7c2f6a3bc20fef280dd77a408af5412',
      //   object: 'yes',
      //   type: 'text',
      // }}],
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
      this.corrections = [];
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
  addCorrection() {
    this.corrections = [
      ...this.corrections,
      new Selection({
        impact: null,
        concept: null,
      }),
    ];
  }

  @action
  removeCorrection(index) {
    this.corrections.splice(index, 1);
    this.corrections = [...this.corrections];
  }

  @action
  editCorrectionConcept(index, selected) {
    this.corrections[index].concept = selected;
    this.corrections = [...this.corrections];
  }

  @action
  editCorrectionImpact(index, selected) {
    this.corrections[index].impact = selected;
    this.corrections = [...this.corrections];
  }
}

class Selection extends EmberObject {
  @tracked
  impact = null;
  @tracked
  concept = null;
}
