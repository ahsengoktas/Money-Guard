export const selectTransactions = (state) => state.finance.transactions;
export const selectCategories = (state) => state.finance.categories;
export const selectTotalBalance = (state) => state.finance.totalBalance;
export const selectFinanceLoading = (state) =>
  state.finance.transactionsLoading || state.finance.categoriesLoading;
export const selectBalanceLoading = (state) => state.finance.balanceLoading;
export const selectBalanceError = (state) => state.finance.balanceError;
export const selectFinanceError = (state) => state.finance.error;
export const selectFinanceMutating = (state) => state.finance.isMutating;
