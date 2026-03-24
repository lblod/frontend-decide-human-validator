import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ValidateRoute extends Route {
  @service store;
  async model(params) {
    const [expression, annotations] = await Promise.all([
      this.store.findRecord('expression', params.expression_id, {
        include: 'annotations,realizes,realizes.passed-by',
      }),
      [
        {
          id: 1,
          type: 'http://www.w3.org/ns/org#Organization',
          value:
            'Lorem ipsum gravida auctor lectus euismod morbi quam sed auctor lectus euismod morbi quam a cut off cut off cut off cut off...',
        },
        {
          id: 2,
          type: 'http://data.europa.eu/eli/ontology#title',
          value:
            'Punt 1: (secretariaat) Algemeen. Goedkeuring van de notulen van de openbare zitting d.d. 25/08/2025',
        },
        {
          id: 3,
          type: 'http://www.w3.org/ns/prov#wasDerivedFrom',
          value:
            'http://data.lblod.info/id/specific-resource/79773ec8-c84c-48e5-80fe-16df18848fb9',
        },
        {
          id: 3,
          type: 'https://w3id.org/airo#AILifecyclePhase',
          value:
            'http://data.lblod.info/id/specific-resource/79773ec8-c84c-48e5-80fe-16df18848fb9',
        },
      ],
    ]);
    return {
      title:
        'Punt 1: (secretariaat) Algemeen. Goedkeuring van de notulen van de openbare zitting d.d. 25/08/2025',
      expression,
      annotations,
      annotationCount: 10,
    };
  }
}
