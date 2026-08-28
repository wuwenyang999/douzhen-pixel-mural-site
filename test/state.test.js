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

test('an unlocked work exposes a coloured section grid', () => {
  const values = new Map();
  const store = createDemoStore({ getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) });
  store.redeem('DOUZHEN-DEMO');

  const grid = store.getSectionGrid('azure-dragon', 'A01');
  assert.equal(grid.rows, 10);
  assert.equal(grid.columns, 10);
  assert.equal(grid.cells.length, 100);
  assert.equal(grid.cells[0].code.startsWith('MARD '), true);
  assert.match(grid.cells[0].hex, /^#[0-9A-F]{6}$/);
});

test('pattern summary reports brand colour totals across all sections', () => {
  const values = new Map();
  const store = createDemoStore({ getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) });
  store.redeem('DOUZHEN-DEMO');

  const summary = store.getPatternSummary('azure-dragon');
  assert.equal(summary.brand, 'MARD 291');
  assert.equal(summary.totalBeads, 300);
  assert.equal(summary.sectionCount, 3);
  assert.equal(summary.colours.reduce((sum, colour) => sum + colour.count, 0), 300);
});
