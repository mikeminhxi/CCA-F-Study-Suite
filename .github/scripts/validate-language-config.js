'use strict';
const fs = require('fs');
const path = require('path');

function validateConfig(config, validCodes) {
  const errors = [];
  const validSet = new Set(validCodes);
  Object.keys(config).forEach(function (code) {
    if (!validSet.has(code)) {
      errors.push('unknown language code "' + code + '" (no matching translations/' + code + '.js or "en")');
      return;
    }
    if (config[code] !== true && config[code] !== false) {
      errors.push('value for "' + code + '" must be true or false, got ' + JSON.stringify(config[code]));
    }
  });
  if (config.en === false) {
    errors.push('"en" cannot be set to false — English is the fallback language and is always shown');
  }
  return { ok: errors.length === 0, errors: errors };
}

function loadConfig(repoRoot) {
  const configPath = path.join(repoRoot, 'languages.config.js');
  const code = fs.readFileSync(configPath, 'utf8');
  const sandboxWindow = {};
  const fn = new Function('window', code);
  fn(sandboxWindow);
  const cfg = sandboxWindow.CCAF_LANG_CONFIG;
  if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg)) {
    throw new Error('languages.config.js did not set window.CCAF_LANG_CONFIG to an object');
  }
  return cfg;
}

function getValidCodes(repoRoot) {
  const translationsDir = path.join(repoRoot, 'translations');
  const codes = fs.readdirSync(translationsDir)
    .filter(function (f) { return f.endsWith('.js'); })
    .map(function (f) { return f.replace(/\.js$/, ''); });
  codes.push('en');
  return codes;
}

function checkLanguageFileParity(repoRoot) {
  const vm = require('vm');
  const dir = path.join(repoRoot, 'translations');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  const REQUIRED_FMT_KEYS = ['questionFmt','questionsAvailableFmt','scoreSoFarFmt',
    'bigScoreFmt','allCorrectFmt','retakeAllFmt','retakeMissedFmt','notThisTimeFmt'];
  let baselineI18nKeys = null, baselineShellKeys = null;
  const errors = [];
  for (const f of files) {
    const code = f.replace(/\.js$/, '');
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    const sandboxWindow = {};
    try {
      vm.runInNewContext(src, { window: sandboxWindow });
    } catch (e) {
      errors.push(f + ': failed to execute (' + e.message + ')');
      continue;
    }
    const data = sandboxWindow['__LANG_' + code.toUpperCase() + '__'];
    if (!data) { errors.push(f + ': did not define window.__LANG_' + code.toUpperCase() + '__'); continue; }
    for (const k of REQUIRED_FMT_KEYS) {
      if (typeof data[k] !== 'function') errors.push(f + ': missing or non-function "' + k + '"');
    }
    const i18nKeys = Object.keys(data.i18n || {}).sort();
    const shellKeys = Object.keys(data.shell || {}).sort();
    if (baselineI18nKeys === null) { baselineI18nKeys = i18nKeys; baselineShellKeys = shellKeys; }
    else {
      if (JSON.stringify(i18nKeys) !== JSON.stringify(baselineI18nKeys)) errors.push(f + ': i18n keyset differs from baseline');
      if (JSON.stringify(shellKeys) !== JSON.stringify(baselineShellKeys)) errors.push(f + ': shell keyset differs from baseline');
    }
  }
  return errors;
}

// Language codes whose README filename suffix differs from the internal
// code used in translations/<code>.js and languages.meta.js.
const README_CODE_EXCEPTIONS = { vn: 'vi', zh: 'zh-cn', tw: 'zh-tw' };
function readmeSuffixFor(code) { return README_CODE_EXCEPTIONS[code] || code; }
function codeFromReadmeSuffix(suffix) {
  for (const code in README_CODE_EXCEPTIONS) {
    if (README_CODE_EXCEPTIONS[code] === suffix) return code;
  }
  return suffix;
}

function loadMeta(repoRoot) {
  const metaPath = path.join(repoRoot, 'languages.meta.js');
  const src = fs.readFileSync(metaPath, 'utf8');
  const sandboxWindow = {};
  const fn = new Function('window', src);
  fn(sandboxWindow);
  const meta = sandboxWindow.CCAF_LANG_META;
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
    throw new Error('languages.meta.js did not set window.CCAF_LANG_META to an object');
  }
  return meta;
}

// Cross-checks the three places Constitution Principle V says the language
// list must never diverge: languages.meta.js (dropdown source of truth),
// translations/<code>.js files, and the README.md switch-link row (plus
// each language's own README.<suffix>.md existing).
function checkLanguageMetaConsistency(repoRoot) {
  const errors = [];
  const meta = loadMeta(repoRoot);
  const metaCodes = Object.keys(meta);
  if (metaCodes[0] !== 'en') {
    errors.push('languages.meta.js: "en" must be the first entry');
  }
  metaCodes.forEach(function (code) {
    if (!meta[code] || typeof meta[code].nativeName !== 'string' || !meta[code].nativeName) {
      errors.push('languages.meta.js: "' + code + '" is missing a non-empty nativeName');
    }
  });
  const nonEnMetaCodes = metaCodes.filter(function (c) { return c !== 'en'; });
  const metaSet = new Set(nonEnMetaCodes);

  const translationsDir = path.join(repoRoot, 'translations');
  const translationCodes = fs.readdirSync(translationsDir)
    .filter(function (f) { return f.endsWith('.js'); })
    .map(function (f) { return f.replace(/\.js$/, ''); });
  const translationSet = new Set(translationCodes);
  nonEnMetaCodes.forEach(function (code) {
    if (!translationSet.has(code)) {
      errors.push('languages.meta.js: "' + code + '" has no matching translations/' + code + '.js');
    }
  });
  translationCodes.forEach(function (code) {
    if (!metaSet.has(code)) {
      errors.push('translations/' + code + '.js: has no matching entry in languages.meta.js');
    }
  });

  const readmePath = path.join(repoRoot, 'README.md');
  const readmeLines = fs.readFileSync(readmePath, 'utf8').split('\n');
  const switchLine = readmeLines.find(function (l) {
    return l.indexOf('English') !== -1 && l.indexOf('](README.') !== -1;
  });
  if (!switchLine) {
    errors.push('README.md: could not find the language switch-link row (a line mentioning "English" with "](README." links)');
    return errors;
  }
  const suffixes = [];
  const re = /\]\(README\.([a-zA-Z0-9-]+)\.md\)/g;
  let m;
  while ((m = re.exec(switchLine))) suffixes.push(m[1]);
  const readmeCodes = suffixes.map(codeFromReadmeSuffix);
  if (JSON.stringify(readmeCodes) !== JSON.stringify(nonEnMetaCodes)) {
    errors.push(
      'README.md switch-link row (' + readmeCodes.join(',') + ') does not match ' +
      'languages.meta.js order (' + nonEnMetaCodes.join(',') + ')'
    );
  }
  nonEnMetaCodes.forEach(function (code) {
    const suffix = readmeSuffixFor(code);
    const p = path.join(repoRoot, 'README.' + suffix + '.md');
    if (!fs.existsSync(p)) {
      errors.push('README.' + suffix + '.md: missing for language "' + code + '" declared in languages.meta.js');
    }
  });

  return errors;
}

function main() {
  const repoRoot = path.resolve(__dirname, '..', '..');
  const config = loadConfig(repoRoot);
  const validCodes = getValidCodes(repoRoot);
  const result = validateConfig(config, validCodes);
  if (!result.ok) {
    result.errors.forEach(function (e) { console.error('ERROR: ' + e); });
    process.exit(1);
  }
  const parityErrors = checkLanguageFileParity(repoRoot);
  if (parityErrors.length) {
    console.error('Language file parity errors:\n' + parityErrors.join('\n'));
    process.exitCode = 1;
    return;
  }
  const metaErrors = checkLanguageMetaConsistency(repoRoot);
  if (metaErrors.length) {
    console.error('Language meta/README consistency errors:\n' + metaErrors.join('\n'));
    process.exitCode = 1;
    return;
  }
  console.log('languages.config.js is valid (' + Object.keys(config).length + ' entries checked).');
}

module.exports = {
  validateConfig: validateConfig,
  loadConfig: loadConfig,
  getValidCodes: getValidCodes,
  checkLanguageFileParity: checkLanguageFileParity,
  loadMeta: loadMeta,
  checkLanguageMetaConsistency: checkLanguageMetaConsistency
};

if (require.main === module) {
  main();
}
