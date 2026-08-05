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
  }
  console.log('languages.config.js is valid (' + Object.keys(config).length + ' entries checked).');
}

module.exports = { validateConfig: validateConfig, loadConfig: loadConfig, getValidCodes: getValidCodes, checkLanguageFileParity: checkLanguageFileParity };

if (require.main === module) {
  main();
}
