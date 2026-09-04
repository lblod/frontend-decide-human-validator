export default function stringForLocale(langStrings, locale = 'en-us') {
  const langTagForLocale = locale.substring(0, 2);
  // First, try to find string for current locale.  If no such string is
  // found, fall back to a default locale.  Finally, fall back to string
  // without language tag.
  const localeString =
    langStrings.find(
      (langString) => langString.language === langTagForLocale,
    ) ||
    langStrings.find((langString) => langString.language === 'en') ||
    langStrings.find((langString) => !langString.language);

  return localeString?.string;
}
