'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { validateConfig, loadConfig, checkLanguageMetaConsistency } = require('./validate-language-config.js');

function writeFixture(dir, opts) {
  fs.mkdirSync(path.join(dir, 'translations'), { recursive: true });
  (opts.translationCodes || []).forEach(function (code) {
    fs.writeFileSync(path.join(dir, 'translations', code + '.js'), 'window.__LANG_' + code.toUpperCase() + '__={};');
  });
  fs.writeFileSync(path.join(dir, 'languages.meta.js'), 'window.CCAF_LANG_META=' + JSON.stringify(opts.meta) + ';');
  fs.writeFileSync(path.join(dir, 'README.md'), opts.readme);
  (opts.readmeFiles || []).forEach(function (suffix) {
    fs.writeFileSync(path.join(dir, 'README.' + suffix + '.md'), '# stub\n');
  });
}

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

test('checkLanguageMetaConsistency accepts a fully consistent fixture', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lang-meta-ok-'));
  writeFixture(dir, {
    meta: { en: { nativeName: 'English' }, fr: { nativeName: 'Français' } },
    translationCodes: ['fr'],
    readme: '**English** · [Français](README.fr.md)\n',
    readmeFiles: ['fr']
  });
  assert.deepEqual(checkLanguageMetaConsistency(dir), []);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('checkLanguageMetaConsistency flags a meta entry with no translations file', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lang-meta-notrans-'));
  writeFixture(dir, {
    meta: { en: { nativeName: 'English' }, fr: { nativeName: 'Français' } },
    translationCodes: [],
    readme: '**English** · [Français](README.fr.md)\n',
    readmeFiles: ['fr']
  });
  const errors = checkLanguageMetaConsistency(dir);
  assert.ok(errors.some(e => e.includes('"fr" has no matching translations/fr.js')));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('checkLanguageMetaConsistency flags an orphan translations file with no meta entry', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lang-meta-orphan-'));
  writeFixture(dir, {
    meta: { en: { nativeName: 'English' } },
    translationCodes: ['fr'],
    readme: '**English**\n'
  });
  const errors = checkLanguageMetaConsistency(dir);
  assert.ok(errors.some(e => e.includes('translations/fr.js: has no matching entry in languages.meta.js')));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('checkLanguageMetaConsistency flags a README switch-link row out of sync with meta order', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lang-meta-order-'));
  writeFixture(dir, {
    meta: { en: { nativeName: 'English' }, fr: { nativeName: 'Français' }, de: { nativeName: 'Deutsch' } },
    translationCodes: ['fr', 'de'],
    readme: '**English** · [Deutsch](README.de.md) · [Français](README.fr.md)\n', // wrong order
    readmeFiles: ['fr', 'de']
  });
  const errors = checkLanguageMetaConsistency(dir);
  assert.ok(errors.some(e => e.includes('does not match') && e.includes('languages.meta.js order')));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('checkLanguageMetaConsistency flags a missing per-language README file', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lang-meta-noreadme-'));
  writeFixture(dir, {
    meta: { en: { nativeName: 'English' }, fr: { nativeName: 'Français' } },
    translationCodes: ['fr'],
    readme: '**English** · [Français](README.fr.md)\n'
    // readmeFiles omitted: README.fr.md does not exist
  });
  const errors = checkLanguageMetaConsistency(dir);
  assert.ok(errors.some(e => e.includes('README.fr.md: missing for language "fr"')));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('checkLanguageMetaConsistency maps zh/tw/vn to their README.zh-cn/zh-tw/vi suffixes', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lang-meta-exceptions-'));
  writeFixture(dir, {
    meta: { en: { nativeName: 'English' }, zh: { nativeName: '简体中文' }, tw: { nativeName: '繁體中文' }, vn: { nativeName: 'Tiếng Việt' } },
    translationCodes: ['zh', 'tw', 'vn'],
    readme: '**English** · [简体中文](README.zh-cn.md) · [繁體中文](README.zh-tw.md) · [Tiếng Việt](README.vi.md)\n',
    readmeFiles: ['zh-cn', 'zh-tw', 'vi']
  });
  assert.deepEqual(checkLanguageMetaConsistency(dir), []);
  fs.rmSync(dir, { recursive: true, force: true });
});
