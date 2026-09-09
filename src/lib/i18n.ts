/**
 * Tiny i18n helper for the language picker and a few picker-adjacent strings.
 *
 * Kept deliberately small: the engine does not ship a full i18n runtime. It
 * only needs a label for the picker button/control and a couple of
 * well-known locale display names. Add more as needed.
 */

export const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  it: 'Italiano',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
  ar: 'العربية',
  hi: 'हिन्दी',
  ru: 'Русский',
  nl: 'Nederlands',
  pl: 'Polski',
  tr: 'Türkçe',
  sv: 'Svenska',
  da: 'Dansk',
  fi: 'Suomi',
  nb: 'Norsk bokmål',
  ro: 'Română',
  hu: 'Magyar',
  cs: 'Čeština',
  el: 'Ελληνικά',
  th: 'ไทย',
  vi: 'Tiếng Việt',
  id: 'Bahasa Indonesia',
  ms: 'Bahasa Melayu',
  tl: 'Filipino',
  uk: 'Українська',
  he: 'עברית',
  bn: 'বাংলা',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  pa: 'ਪੰਜਾਬੀ',
  ur: 'اردو',
  fa: 'فارسی',
  sw: 'Kiswahili',
  af: 'Afrikaans',
  ca: 'Català',
  eu: 'Euskara',
  gl: 'Galego',
  sq: 'Shqip',
  mk: 'Македонски',
  sr: 'Српски',
  bg: 'Български',
  hr: 'Hrvatski',
  sk: 'Slovenčina',
  sl: 'Slovenščina',
  lt: 'Lietuvių',
  lv: 'Latviešu',
  et: 'Eesti',
  is: 'Íslenska',
  cy: 'Cymraeg',
  ga: 'Gaeilge',
  mt: 'Malti',
  la: 'Latina',
};

export function localeLabel(code: string): string {
  return LOCALE_LABELS[code] ?? code;
}
