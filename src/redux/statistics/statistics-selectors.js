import { createSelector } from '@reduxjs/toolkit';

import { getExpenseCategories } from '../../helpers/statistics.js';

export const selectStatisticsPeriod = createSelector(
  [(state) => state.statistics.month, (state) => state.statistics.year],
  (month, year) => ({ month, year }),
);
export const selectStatisticsSummary = (state) => state.statistics.summary;
export const selectStatisticsLoading = (state) => state.statistics.isLoading;
export const selectStatisticsError = (state) => state.statistics.error;

// TASK-67 / TASK-71: expense categories with a colour, used by Chart and Table.
export const selectExpenseCategories = createSelector(
  [selectStatisticsSummary],
  (summary) => getExpenseCategories(summary?.categoriesSummary),
);
