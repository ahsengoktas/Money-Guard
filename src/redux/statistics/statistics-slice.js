import { createSlice } from '@reduxjs/toolkit';

import { logOut, refreshUser } from '../auth/auth-operations';
import { fetchStatistics } from './statistics-operations';

// TASK-64: the current month is shown first.
const getInitialState = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    summary: null,
    isLoading: false,
    error: null,
  };
};

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState: getInitialState,
  reducers: {
    // TASK-69: the selected period is kept while the user switches tabs.
    setPeriod(state, { payload }) {
      state.month = payload.month;
      state.year = payload.year;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.summary = payload;
      })
      .addCase(fetchStatistics.rejected, (state, { payload, error }) => {
        state.isLoading = false;
        state.error = payload ?? error.message;
      })
      .addCase(logOut.fulfilled, getInitialState)
      .addCase(logOut.rejected, getInitialState)
      .addCase(refreshUser.rejected, getInitialState);
  },
});

export const { setPeriod } = statisticsSlice.actions;
export const statisticsReducer = statisticsSlice.reducer;
