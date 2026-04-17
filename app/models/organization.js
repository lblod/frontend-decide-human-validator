import Model, { attr, belongsTo } from '@ember-data/model';

export default class OrganizationModel extends Model {
  @attr('string') uri;
  @attr('language-string') prefLabel;
  @attr('string') classification;
  @attr('boolean') showInHVT;

  @belongsTo('organization', {
    inverse: null,
    async: true,
  })
  subOrganizationOf;
}
