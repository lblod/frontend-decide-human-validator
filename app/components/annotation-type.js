import Component from '@glimmer/component';

const prefixes = {
  oa: 'http://www.w3.org/ns/oa#',
  dct: 'http://purl.org/dc/terms/',
  prov: 'http://www.w3.org/ns/prov#',
  org: 'http://www.w3.org/ns/org#',
  eli: 'http://data.europa.eu/eli/ontology#',
  ext: 'http://mu.semte.ch/vocabularies/ext/',
};

export default class AnnotationType extends Component {
  get typeLink() {
    const type = this.args.annotation.type;
    if (type.startsWith('http')) {
      return type;
    }
    return '#';
  }

  get typeText() {
    let type = this.args.annotation.type;
    for (const prefix in prefixes) {
      if (type.startsWith(prefixes[prefix])) {
        type = type.replace(prefixes[prefix], prefix + ':');
        break;
      }
    }
    return type;
  }
}
