const NO_MATCH_URI = 'http://mu.semte.ch/vocabularies/ext/no-match-found';
const MAX_VALUE_LENGTH = 200;

export function isNoMatch(annotation) {
  return annotation.valueText?.startsWith(NO_MATCH_URI);
}

export function annotationValueLabel(annotation, intl) {
  if (isNoMatch(annotation)) {
    return intl.t('expression-annotation-no-match');
  }
  const value = annotation.valueText;
  if (value && value.length > MAX_VALUE_LENGTH) {
    return value.substring(0, MAX_VALUE_LENGTH) + '...';
  }
  return value;
}
