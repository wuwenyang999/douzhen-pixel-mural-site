const test = require('node:test');
const assert = require('node:assert/strict');
const { createDemoStore } = require('../state.js');

test('valid demo code unlocks one work once', () => {
  const values = new Map();
  const store = createDemoStore({ getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) });

  assert.deepEqual(store.redeem('DOUZHEN-DEMO'), { ok: true, patternId: 'azure-dragon' });
  assert.deepEqual(store.redeem('DOUZHEN-DEMO'), { ok: false, reason: 'used' });
});

test('completed section is kept for an unlocked work', () => {
  const values = new Map();
  const store = createDemoStore({ getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) });
  store.redeem('DOUZHEN-DEMO');

  assert.equal(store.toggleSection('azure-dragon', 'A01'), true);
  assert.deepEqual(store.getCompletedSections('azure-dragon'), ['A01']);
});
