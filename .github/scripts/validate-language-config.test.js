'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { validateConfig, loadConfig } = require('./validate-language-config.js');

test('accepts an all-true config with valid codes', function () {
  const result = validateConfig({ en: true, fr: true }, ['en', 'fr', 'de']);
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test('accepts missing keys (fail-open)', function () {
  const result = validateConfig({ en: true }, ['en', 'fr', 'de']);
  assert.equal(result.ok, true);
});

test('rejects an unknown language code', function () {
  const result = validateConfig({ en: true, xx: true }, ['en', 'fr']);
  assert.equal(result.ok, false);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /unknown language code "xx"/);
});

test('rejects a non-boolean value', function () {
  const result = validateConfig({ en: true, fr: 'nope' }, ['en', 'fr']);
  assert.equal(result.ok, false);
  assert.match(result.errors[0], /must be true or false/);
});

test('rejects en set to false', function () {
  const result = validateConfig({ en: false }, ['en']);
  assert.equal(result.ok, false);
  assert.match(result.errors[0], /"en" cannot be set to false/);
});

test('loadConfig throws when languages.config.js does not set window.CCAF_LANG_CONFIG', function () {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ccaf-lang-config-test-'));
  fs.writeFileSync(
    path.join(tempDir, 'languages.config.js'),
    'var somethingElse = {en: true};\n'
  );
  assert.throws(function () {
    loadConfig(tempDir);
  }, /did not set window\.CCAF_LANG_CONFIG/);
});

test('checkLanguageFileParity flags a keyset mismatch', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lang-parity-'));
  fs.mkdirSync(path.join(dir, 'translations'));
  fs.writeFileSync(path.join(dir, 'translations', 'aa.js'),
    "window.__LANG_AA__={questionFmt:function(){},questionsAvailableFmt:function(){}," +
    "scoreSoFarFmt:function(){},bigScoreFmt:function(){},allCorrectFmt:function(){}," +
    "retakeAllFmt:function(){},retakeMissedFmt:function(){},notThisTimeFmt:function(){}," +
    "i18n:{a:'1',b:'2'},shell:{x:'1'}};");
  fs.writeFileSync(path.join(dir, 'translations', 'bb.js'),
    "window.__LANG_BB__={questionFmt:function(){},questionsAvailableFmt:function(){}," +
    "scoreSoFarFmt:function(){},bigScoreFmt:function(){},allCorrectFmt:function(){}," +
    "retakeAllFmt:function(){},retakeMissedFmt:function(){},notThisTimeFmt:function(){}," +
    "i18n:{a:'1'},shell:{x:'1'}};"); // missing key 'b' -- should be flagged
  const { checkLanguageFileParity } = require('./validate-language-config.js');
  const errors = checkLanguageFileParity(dir);
  assert.ok(errors.some(e => e.includes('bb.js') && e.includes('i18n keyset differs')));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('checkLanguageFileParity reports a per-file error instead of crashing when a file throws', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lang-parity-throw-'));
  fs.mkdirSync(path.join(dir, 'translations'));
  fs.writeFileSync(path.join(dir, 'translations', 'aa.js'),
    "window.__LANG_AA__={questionFmt:function(){},questionsAvailableFmt:function(){}," +
    "scoreSoFarFmt:function(){},bigScoreFmt:function(){},allCorrectFmt:function(){}," +
    "retakeAllFmt:function(){},retakeMissedFmt:function(){},notThisTimeFmt:function(){}," +
    "i18n:{a:'1'},shell:{x:'1'}};");
  fs.writeFileSync(path.join(dir, 'translations', 'cc.js'), "throw new Error('boom');");
  const { checkLanguageFileParity } = require('./validate-language-config.js');
  const errors = checkLanguageFileParity(dir);
  assert.ok(errors.some(e => e.includes('cc.js') && e.includes('failed to execute') && e.includes('boom')));
  fs.rmSync(dir, { recursive: true, force: true });
});
