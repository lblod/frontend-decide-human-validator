import { prefixes } from '../utils/prefixes';

export default function prefixedUrl(url) {
  for (const prefix in prefixes) {
    if (url?.startsWith(prefixes[prefix])) {
      if (prefix === 'xsd') {
        url = url.replace(prefixes[prefix], '');
      } else {
        url = url.replace(prefixes[prefix], prefix + ':');
      }

      break;
    }
  }
  return url;
}
