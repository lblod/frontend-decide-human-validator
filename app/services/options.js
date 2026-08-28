import Service, { service } from '@ember/service';

export default class OptionsService extends Service {
  @service store;

  _predicates = [];
  _aiModels = [];
  _valueTypes = [];

  async predicates() {
    if (this._predicates?.length >= 1) {
      return this._predicates;
    }

    const response = await fetch(`/annotation-review/options/predicates`);
    const results = await response.json();

    this._predicates = results ?? [];

    return this._predicates;
  }

  async aiModels() {
    if (this._aiModels?.length >= 1) {
      return this._aiModels;
    }

    const response = await fetch(`/annotation-review/options/ai-models`);
    const results = await response.json();

    this._aiModels = results ?? [];

    return this._aiModels;
  }

  async valueTypes() {
    if (this._valueTypes?.length >= 1) {
      return this._valueTypes;
    }

    const response = await fetch(`/annotation-review/options/value-types`);
    const results = await response.json();

    this._valueTypes = results ?? [];

    return this._valueTypes;
  }
}
