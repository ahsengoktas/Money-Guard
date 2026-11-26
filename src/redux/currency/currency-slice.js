import { createSlice } from '@reduxjs/toolkit';
import { fetchCurrencyRates } from './currency-operations.js';

const initialState = {
  rates: [],
  updatedAt: null,
  status: 'idle',
  error: null,
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencyRates.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrencyRates.fulfilled, (state, { payload }) => {
        state.rates = payload.rates;
        state.updatedAt = payload.updatedAt;
        state.status = 'succeeded';
      })
      .addCase(fetchCurrencyRates.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload?.message ?? 'Unable to load exchange rates.';
        if (
          payload?.cached &&
          payload.cached.updatedAt > (state.updatedAt ?? 0)
        ) {
          state.rates = payload.cached.rates;
          state.updatedAt = payload.cached.updatedAt;
        }
      });
  },
});

export const currencyReducer = currencySlice.reducer;
