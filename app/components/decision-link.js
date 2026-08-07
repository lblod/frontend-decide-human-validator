import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class DecisionLink extends Component {
  @tracked
  showContent = false;

  @tracked
  work = null;

  @tracked
  complexWorks = [];

  @tracked
  actionPlanContents = [];

  @tracked
  memberWorkContents = [];

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

    const isPartOf = await work.isPartOf;
    const complexWorks = isPartOf?.toArray ? isPartOf.toArray() : (isPartOf ?? []);
    this.complexWorks = complexWorks;

    const expressionLists = await Promise.all(
      complexWorks.map((complexWork) => complexWork.isRealizedBy)
    );

    const actionPlanExpressions = expressionLists.flatMap((list) =>
      list?.toArray ? list.toArray() : (list ?? [])
    );

    this.actionPlanContents = actionPlanExpressions
      .map((expression) => expression.description)
      .filter(Boolean);

    const memberWorkLists = await Promise.all(
      complexWorks.map((complexWork) => complexWork.hasMember)
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
      .map((expression) => expression.trimmedExpressionContent)
      .filter(Boolean);
  }

  @action
  openDecisionText() {
    this.showContent = true;
  }

  @action
  hideDecisionText() {
    this.showContent = false;
  }
}
