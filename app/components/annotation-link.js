import Component from '@glimmer/component';
import { service } from '@ember/service';
import stringForLocale from '../helpers/locale-language-string';

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
      stringForLocale(
        this.args.annotation.linkComments,
        this.intl.primaryLocale,
      ) || this.intl.t('annotation-link-no-info')
    );
  }
}
