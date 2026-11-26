import { createAsyncThunk } from '@reduxjs/toolkit';

import { walletApi } from '../../services/api';

const getErrorMessage = (error) => {
  const message = error.response?.data?.message ?? error.message;
  return Array.isArray(message) ? message.join(', ') : String(message);
};

// GET /transactions-summary?month&year (TASK-64, TASK-69)
// -> { categoriesSummary, incomeSummary, expenseSummary, periodTotal, month, year }
export const fetchStatistics = createAsyncThunk(
  'statistics/fetchStatistics',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const { data } = await walletApi.get('/transactions-summary', {
        params: { month, year },
      });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
