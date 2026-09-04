import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class AnnotationLink extends Component {
  @service intl;

  get linkLink() {
    const link = this.args.annotation.link;
    if (link?.startsWith('http')) {
      return link;
    }
    return null;
  }

  get linkComment() {
    return (
      this.args.annotation.linkComment || this.intl.t('annotation-link-no-info')
    );
  }
}
