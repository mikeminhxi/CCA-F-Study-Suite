'use strict';
const fs = require('fs');
const path = require('path');

function validateConfig(config, validCodes) {
  const errors = [];
  const validSet = new Set(validCodes);
  Object.keys(config).forEach(function (code) {
    if (!validSet.has(code)) {
      errors.push('unknown language code "' + code + '" (no matching translations/' + code + '.json or "en")');
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
    .filter(function (f) { return f.endsWith('.json'); })
    .map(function (f) { return f.replace(/\.json$/, ''); });
  codes.push('en');
  return codes;
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
  console.log('languages.config.js is valid (' + Object.keys(config).length + ' entries checked).');
}

module.exports = { validateConfig: validateConfig, loadConfig: loadConfig, getValidCodes: getValidCodes };

if (require.main === module) {
  main();
}
