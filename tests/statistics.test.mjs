import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  formatAmount,
  getExpenseCategories,
  getYearOptions,
} from '../src/helpers/statistics.js';

test('only expense categories are kept, as positive totals with colours', () => {
  const result = getExpenseCategories([
    { name: 'Car', type: 'EXPENSE', total: -1500 },
    { name: 'Income', type: 'INCOME', total: 8000 },
    { name: 'Leisure', type: 'EXPENSE', total: 0 },
    { name: 'Unknown', type: 'EXPENSE', total: -10 },
  ]);
  assert.deepEqual(
    result.map(({ name, total }) => [name, total]),
    [
      ['Car', 1500],
      ['Unknown', 10],
    ],
  );
  assert.equal(result[0].color, '#fd9498');
  assert.match(result[1].color, /^#[0-9a-f]{6}$/);
});

test('missing summary gives an empty list', () => {
  assert.deepEqual(getExpenseCategories(undefined), []);
});

test('amounts use the app format', () => {
  assert.equal(formatAmount(-22549.24), '22 549.24');
  assert.equal(formatAmount(300), '300.00');
  assert.equal(formatAmount(null), '0.00');
});

test('year options start from the current year', () => {
  assert.deepEqual(getYearOptions(2026, 3), [2026, 2025, 2024]);
});
