import Service from '@ember/service';

export default class OptionsService extends Service {
  async predicates() {
    const response = await fetch(`/annotation-review/options/predicates`);
    const results = await response.json();

    return results ?? [];
  }
}
