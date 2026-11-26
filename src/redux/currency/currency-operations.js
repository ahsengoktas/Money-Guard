import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  isFresh,
  normalizeRates,
  readCurrencyCache,
  writeCurrencyCache,
} from './currency-cache.js';

const getCurrencyApiUrl = () =>
  import.meta.env?.VITE_CURRENCY_API_URL ??
  globalThis.process?.env?.VITE_CURRENCY_API_URL;
const REQUEST_TIMEOUT_MS = 10_000;

export const fetchCurrencyRates = createAsyncThunk(
  'currency/fetchRates',
  async (_, { rejectWithValue, signal }) => {
    const cached = readCurrencyCache();
    if (cached && isFresh(cached.updatedAt)) return cached;
    const apiUrl = getCurrencyApiUrl();

    if (!apiUrl) {
      return rejectWithValue({
        message: 'Currency API URL is not configured.',
        cached,
      });
    }
    try {
      // Public API: use a separate client, never the authenticated wallet API.
      const { data } = await axios.get(apiUrl, {
        timeout: REQUEST_TIMEOUT_MS,
        signal,
      });
      const result = { rates: normalizeRates(data), updatedAt: Date.now() };
      writeCurrencyCache(result);
      return result;
    } catch (error) {
      const message =
        error.response?.status === 429
          ? 'Too many requests. Please try again later.'
          : 'Unable to load exchange rates.';
      return rejectWithValue({ message, cached });
    }
  },
  {
    condition: (_, { getState }) => {
      const { status, updatedAt } = getState().currency;
      return status !== 'loading' && !isFresh(updatedAt);
    },
  },
);
