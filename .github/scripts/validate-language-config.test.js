'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { validateConfig } = require('./validate-language-config.js');

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
