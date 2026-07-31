'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { renderConfig, orderConfig, sync } = require('./sync-language-config.js');

test('orderConfig always puts en first regardless of input order', function () {
  const ordered = orderConfig({ fr: true, en: true, de: false });
  assert.deepEqual(Object.keys(ordered), ['en', 'fr', 'de']);
});

test('renderConfig produces the expected window.CCAF_LANG_CONFIG file', function () {
  const rendered = renderConfig({ en: true, fr: true, de: false });
  assert.match(rendered, /^\/\/ languages\.config\.js/);
  assert.match(rendered, /window\.CCAF_LANG_CONFIG = \{\n {2}en: true,\n {2}fr: true,\n {2}de: false\n\};\n$/);
});

function makeRepo(existingConfig) {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ccaf-sync-test-'));
  fs.mkdirSync(path.join(repoRoot, 'translations'));
  ['fr', 'de'].forEach(function (code) {
    fs.writeFileSync(path.join(repoRoot, 'translations', code + '.json'), '{}');
  });
  if (existingConfig !== undefined) {
    fs.writeFileSync(path.join(repoRoot, 'languages.config.js'), existingConfig);
  }
  return repoRoot;
}

test('sync writes languages.config.js and reports changed on first run', function () {
  const repoRoot = makeRepo(undefined);
  const result = sync(repoRoot, JSON.stringify({ en: true, fr: true, de: false }));
  assert.equal(result.changed, true);
  const written = fs.readFileSync(path.join(repoRoot, 'languages.config.js'), 'utf8');
  assert.equal(written, result.rendered);
});

test('sync reports unchanged when rendered content matches the existing file', function () {
  const repoRoot = makeRepo(undefined);
  const first = sync(repoRoot, JSON.stringify({ en: true, fr: true, de: false }));
  const second = sync(repoRoot, JSON.stringify({ en: true, fr: true, de: false }));
  assert.equal(first.changed, true);
  assert.equal(second.changed, false);
});

test('sync throws on invalid JSON', function () {
  const repoRoot = makeRepo(undefined);
  assert.throws(function () {
    sync(repoRoot, '{not json');
  }, /not valid JSON/);
});

test('sync throws on unknown language code', function () {
  const repoRoot = makeRepo(undefined);
  assert.throws(function () {
    sync(repoRoot, JSON.stringify({ en: true, xx: true }));
  }, /invalid/);
});

test('sync throws when en is set to false', function () {
  const repoRoot = makeRepo(undefined);
  assert.throws(function () {
    sync(repoRoot, JSON.stringify({ en: false }));
  }, /invalid/);
});
