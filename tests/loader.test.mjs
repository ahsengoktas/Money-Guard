import assert from 'node:assert/strict';
import { test } from 'node:test';
import { configureStore, createAsyncThunk } from '@reduxjs/toolkit';

import { globalReducer } from '../src/redux/global/global-slice.js';
import { selectIsLoading } from '../src/redux/global/global-selectors.js';

const createStore = () =>
  configureStore({ reducer: { global: globalReducer } });

test('initial state is idle', () => {
  const store = createStore();
  assert.equal(selectIsLoading(store.getState()), false);
});

test('loader remains visible until all parallel requests settle', async () => {
  const store = createStore();
  let resolveFirst;
  let rejectSecond;
  const first = createAsyncThunk(
    'test/first',
    () => new Promise((resolve) => (resolveFirst = resolve)),
  );
  const second = createAsyncThunk(
    'test/second',
    () => new Promise((_, reject) => (rejectSecond = reject)),
  );

  const firstRequest = store.dispatch(first());
  const secondRequest = store.dispatch(second());
  assert.equal(selectIsLoading(store.getState()), true);
  assert.equal(store.getState().global.pendingRequestIds.length, 2);

  resolveFirst('ok');
  await firstRequest;
  assert.equal(selectIsLoading(store.getState()), true);

  rejectSecond(new Error('network'));
  await secondRequest;
  assert.equal(selectIsLoading(store.getState()), false);
  assert.deepEqual(store.getState().global.pendingRequestIds, []);
});

test('a successful request returns to idle', async () => {
  const store = createStore();
  const request = createAsyncThunk('test/success', async () => 'ok');
  const pending = store.dispatch(request());
  assert.equal(selectIsLoading(store.getState()), true);
  await pending;
  assert.equal(selectIsLoading(store.getState()), false);
});

test('a skipped request does not clear another active request', async () => {
  const store = createStore();
  const hanging = createAsyncThunk('test/hanging', () => new Promise(() => {}));
  const active = store.dispatch(hanging());
  const skip = createAsyncThunk('test/skip', () => {}, {
    condition: () => false,
    dispatchConditionRejection: true,
  });

  await store.dispatch(skip());
  assert.equal(selectIsLoading(store.getState()), true);
  active.abort();
  await active;
  assert.equal(selectIsLoading(store.getState()), false);
  assert.deepEqual(store.getState().global.pendingRequestIds, []);
});

test('a rejected request returns to idle', async () => {
  const store = createStore();
  const request = createAsyncThunk('test/error', async () => {
    throw new Error('network');
  });
  await store.dispatch(request());
  assert.equal(selectIsLoading(store.getState()), false);
});
