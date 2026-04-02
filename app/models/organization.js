import Model, {attr, belongsTo} from '@ember-data/model';

export default class OrganizationModel extends Model {
  @attr('string') uri;
  @attr('language-string') prefLabel;
  @attr('string') classification;

  @belongsTo('organization', {
    inverse: null,
    async: true,
  })
  subOrganizationOf;
}
