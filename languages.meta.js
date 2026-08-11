// languages.meta.js
// Display metadata for every translatable language: native name shown in
// #lang-select, in the order the dropdown renders them (Latin-script first
// alphabetical by English name, then CJK grouped, then Cyrillic/other
// scripts, then RTL last). This is the single source of truth for the
// dropdown's option list — script.js builds <option> elements from this
// object filtered by languages.config.js, rather than the HTML hand-listing
// them. Hand-maintained (unlike languages.config.js, this is not synced
// from a repo Variable) — add a line here when adding a new language.
window.CCAF_LANG_META = {
  en: { nativeName: "English" },
  nl: { nativeName: "Nederlands" },
  fr: { nativeName: "Français" },
  de: { nativeName: "Deutsch" },
  id: { nativeName: "Bahasa Indonesia" },
  it: { nativeName: "Italiano" },
  ms: { nativeName: "Bahasa Melayu" },
  pl: { nativeName: "Polski" },
  pt: { nativeName: "Português" },
  es: { nativeName: "Español" },
  sv: { nativeName: "Svenska" },
  vn: { nativeName: "Tiếng Việt" },
  zh: { nativeName: "简体中文" },
  tw: { nativeName: "繁體中文" },
  ja: { nativeName: "日本語" },
  ko: { nativeName: "한국어" },
  hi: { nativeName: "हिन्दी" },
  ru: { nativeName: "Русский" },
  uk: { nativeName: "Українська" },
  th: { nativeName: "ไทย" },
  el: { nativeName: "Ελληνικά" },
  ar: { nativeName: "العربية" },
  he: { nativeName: "עברית" }
};
