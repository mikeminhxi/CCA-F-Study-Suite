'use strict';
const fs = require('fs');
const path = require('path');
const { validateConfig, getValidCodes } = require('./validate-language-config.js');

function renderConfig(config) {
  const keys = Object.keys(config);
  const lines = keys.map(function (code) {
    return '  ' + code + ': ' + (config[code] === false ? 'false' : 'true') + ',';
  });
  if (lines.length > 0) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '');
  }
  return [
    '// languages.config.js',
    '// Controls which languages appear in the #lang-select dropdown.',
    '// A code missing from this object is treated as enabled (true).',
    '// "en" can never be disabled — runtime and CI both enforce this.',
    '//',
    '// Generated. Do not hand-edit — change the CCAF_LANG_CONFIG repo Variable',
    '// (Settings -> Secrets and variables -> Actions -> Variables) and run the',
    '// "Sync language config" GitHub Action instead; it regenerates this file.',
    'window.CCAF_LANG_CONFIG = {',
    lines.join('\n'),
    '};',
    ''
  ].join('\n');
}

function orderConfig(rawConfig) {
  // "en" always listed first; validateConfig already guarantees it isn't false.
  const ordered = { en: true };
  Object.keys(rawConfig).forEach(function (code) {
    if (code !== 'en') {
      ordered[code] = rawConfig[code];
    }
  });
  return ordered;
}

function sync(repoRoot, rawJson) {
  const validCodes = getValidCodes(repoRoot);
  let parsed;
  try {
    parsed = JSON.parse(rawJson);
  } catch (e) {
    throw new Error('CCAF_LANG_CONFIG variable is not valid JSON: ' + e.message);
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('CCAF_LANG_CONFIG variable must be a JSON object');
  }
  const result = validateConfig(parsed, validCodes);
  if (!result.ok) {
    throw new Error('CCAF_LANG_CONFIG variable is invalid:\n' + result.errors.map(function (e) { return '  - ' + e; }).join('\n'));
  }

  const ordered = orderConfig(parsed);
  const rendered = renderConfig(ordered);
  const configPath = path.join(repoRoot, 'languages.config.js');
  const current = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf8') : null;
  const changed = current !== rendered;
  if (changed) {
    fs.writeFileSync(configPath, rendered);
  }
  return { changed: changed, rendered: rendered };
}

function main() {
  const repoRoot = path.resolve(__dirname, '..', '..');
  const rawJson = process.env.CCAF_LANG_CONFIG;
  if (!rawJson) {
    throw new Error('CCAF_LANG_CONFIG environment variable is not set');
  }
  const result = sync(repoRoot, rawJson);
  console.log(result.changed ? 'languages.config.js updated.' : 'languages.config.js already up to date.');
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (githubOutput) {
    fs.appendFileSync(githubOutput, 'changed=' + String(result.changed) + '\n');
  }
}

module.exports = { renderConfig: renderConfig, orderConfig: orderConfig, sync: sync };

if (require.main === module) {
  main();
}
