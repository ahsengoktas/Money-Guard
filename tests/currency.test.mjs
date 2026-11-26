import assert from 'node:assert/strict';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';

import { currencyReducer } from '../src/redux/currency/currency-slice.js';
import { fetchCurrencyRates } from '../src/redux/currency/currency-operations.js';
import {
  CACHE_TTL_MS,
  isFresh,
  normalizeRates,
  readCurrencyCache,
  writeCurrencyCache,
} from '../src/redux/currency/currency-cache.js';

const TEST_API_URL = 'https://example.test/bank/currency';

process.env.VITE_CURRENCY_API_URL = TEST_API_URL;

const store = () =>
  configureStore({
    reducer: { currency: currencyReducer },
  });

const storage = new Map();

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (k) => storage.get(k) ?? null,
    setItem: (k, v) => storage.set(k, v),
  },
});

const rows = [
  { currencyCodeA: 978, currencyCodeB: 980, rateBuy: 44.1, rateSell: 44.5 },
  { currencyCodeA: 840, currencyCodeB: 980, rateBuy: 41.2, rateSell: 41.6 },
  { currencyCodeA: 840, currencyCodeB: 978, rateBuy: 0.9, rateSell: 1 },
];

assert.deepEqual(normalizeRates(rows), [
  { code: 'USD', buy: 41.2, sell: 41.6 },
  { code: 'EUR', buy: 44.1, sell: 44.5 },
]);

assert.throws(() => normalizeRates([]));

assert.equal(isFresh(100, 100 + CACHE_TTL_MS - 1), true);
assert.equal(isFresh(100, 100 + CACHE_TTL_MS), false);
assert.equal(isFresh(100, 99), false);

let calls = 0;

axios.get = async (url, config) => {
  assert.equal(url, TEST_API_URL);
  assert.equal(config.timeout, 10000);

  calls++;

  await new Promise((resolve) => setTimeout(resolve, 20));

  return { data: rows };
};

const initialStore = store();

await Promise.all([
  initialStore.dispatch(fetchCurrencyRates()),
  initialStore.dispatch(fetchCurrencyRates()),
]);

assert.equal(calls, 1);
assert.equal(initialStore.getState().currency.status, 'succeeded');
assert.equal(readCurrencyCache().rates.length, 2);

await initialStore.dispatch(fetchCurrencyRates());
assert.equal(calls, 1);

const reloadedStore = store();

await reloadedStore.dispatch(fetchCurrencyRates());

assert.equal(calls, 1);
assert.deepEqual(reloadedStore.getState().currency.rates, normalizeRates(rows));

writeCurrencyCache({
  rates: normalizeRates(rows),
  updatedAt: Date.now() - CACHE_TTL_MS,
});

const expiredStore = store();

await expiredStore.dispatch(fetchCurrencyRates());
assert.equal(calls, 2);

writeCurrencyCache({
  rates: normalizeRates(rows),
  updatedAt: Date.now() - CACHE_TTL_MS,
});

axios.get = async () => {
  calls++;

  throw Object.assign(new Error('Rate limit'), {
    response: { status: 429 },
  });
};

const failedStore = store();

await failedStore.dispatch(fetchCurrencyRates());

assert.equal(failedStore.getState().currency.status, 'failed');
assert.match(failedStore.getState().currency.error, /Too many/);
assert.equal(failedStore.getState().currency.rates.length, 2);

axios.get = async () => {
  calls++;
  return { data: rows };
};

await failedStore.dispatch(fetchCurrencyRates());

assert.equal(failedStore.getState().currency.status, 'succeeded');

for (const k of storage.keys()) {
  storage.set(k, 'broken json');
}

assert.equal(readCurrencyCache(), null);

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  get() {
    throw new Error('blocked');
  },
});

const blockedStorageStore = store();

await blockedStorageStore.dispatch(fetchCurrencyRates());

assert.equal(blockedStorageStore.getState().currency.status, 'succeeded');
