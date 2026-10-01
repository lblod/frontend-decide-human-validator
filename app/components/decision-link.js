import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { annotationValueLabel } from '../utils/annotation-value';

export default class DecisionLink extends Component {
  @service intl;

  @tracked
  showContent = false;

  @tracked
  work = null;

  @tracked
  complexWorks = [];

  @tracked
  actionPlanContents = [];

  @tracked
  policyGoalContents = [];

  @tracked
  memberWorkContents = [];

  @tracked
  organizations = [];

  @tracked
  organizationTypes = [];

  @tracked
  otherAnnotationValues = [];

  constructor(owner, args) {
    super(owner, args);
    this.loadRelations();
  }

  async loadRelations() {
    const work = await this.args.expression?.realizes;
    this.work = work;

    if (!work) {
      return;
    }

    this.organizations = await work.passedBy;
    this.organizationTypes = [];
    for (let i = 0; i < this.organizations?.length; i++) {
      if (this.organizations[i].classification === "http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000001") {
        this.organizationTypes.push('Gemeente');
      } else if (this.organizations[i].classification === "http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000002") {
        this.organizationTypes.push('OCMW');
      } else {
        this.organizationTypes.push(undefined);
      }
    }

    const isMemberOf = await work.isMemberOf;
    const complexWorks = isMemberOf?.toArray ? isMemberOf.toArray() : (isMemberOf ?? []);
    this.complexWorks = complexWorks;

    const expressionLists = await Promise.all(
      complexWorks.map((complexWork) => complexWork.isRealizedBy)
    );

    const actionPlanExpressions = expressionLists.flatMap((list) =>
      list?.toArray ? list.toArray() : (list ?? [])
    );

    this.actionPlanContents = actionPlanExpressions
      .map((expression) => expression.description);

    const policyGoalLists = await Promise.all(
      complexWorks.map((complexWork) => complexWork.isMemberOf)
    );

    const policyGoals = policyGoalLists.flatMap((list) =>
      list?.toArray ? list.toArray() : (list ?? [])
    );

    const policyGoalExpressionLists = await Promise.all(
      policyGoals.map((policyGoal) => policyGoal.isRealizedBy)
    );

    const policyGoalExpressions = policyGoalExpressionLists.flatMap((list) =>
      list?.toArray ? list.toArray() : (list ?? [])
    );

    this.policyGoalContents = policyGoalExpressions
      .map((expression) => expression.description);

    const memberWorkLists = await Promise.all(
      complexWorks.map((complexWork) => complexWork.members)
    );

    const memberWorks = memberWorkLists.flatMap((list) =>
      list?.toArray ? list.toArray() : (list ?? [])
    );

    const memberExpressionLists = await Promise.all(
      memberWorks.map((memberWork) => memberWork.isRealizedBy)
    );

    const memberExpressions = memberExpressionLists.flatMap((list) =>
      list?.toArray ? list.toArray() : (list ?? [])
    );

    this.memberWorkContents = memberExpressions
      .map((expression) => expression.trimmedExpressionContent || expression.description)
      .filter((text) => {
        return text !== this.args.expression?.trimmedExpressionContent;
      });
  }

  async loadOtherAnnotationValues() {
    const { annotationType, expression, currentAnnotation } = this.args;
    if (!annotationType || !expression?.id) {
      return;
    }
    try {
      const response = await fetch(
        `/annotation-review/annotations/${annotationType}/${expression.id}?page=0&pageSize=100`,
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const { annotations } = await response.json();
      const currentLabel = currentAnnotation
        ? annotationValueLabel(currentAnnotation, this.intl)
        : null;
      const labels = annotations
        .filter((annotation) => annotation.id !== currentAnnotation?.id)
        .map((annotation) => annotationValueLabel(annotation, this.intl))
        .filter((label) => label && label !== currentLabel);
      this.otherAnnotationValues = [...new Set(labels)];
    } catch (error) {
      console.error('Could not load other annotations for decision', error);
      this.otherAnnotationValues = [];
    }
  }

  @action
  openDecisionText() {
    this.showContent = true;
    this.loadOtherAnnotationValues();
  }

  @action
  hideDecisionText() {
    this.showContent = false;
  }
}
