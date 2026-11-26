import { createSlice } from '@reduxjs/toolkit';
import { logOut, refreshUser } from '../auth/auth-operations';
import {
  addTransaction,
  deleteTransaction,
  editTransaction,
  fetchBalance,
  fetchCategories,
  fetchTransactions,
} from './finance-operations';

const initialState = {
  transactions: [],
  categories: [],
  totalBalance: 0,
  transactionsLoading: false,
  categoriesLoading: false,
  balanceLoading: false,
  isMutating: false,
  error: null,
  balanceError: null,
};

const pendingMutation = (state) => {
  state.isMutating = true;
};
const settledMutation = (state) => {
  state.isMutating = false;
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.transactionsLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, { payload }) => {
        state.transactionsLoading = false;
        state.transactions = payload;
      })
      .addCase(fetchTransactions.rejected, (state, { payload, error }) => {
        state.transactionsLoading = false;
        state.error = payload ?? error.message;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, { payload }) => {
        state.categoriesLoading = false;
        state.categories = payload;
      })
      .addCase(fetchCategories.rejected, (state, { payload, error }) => {
        state.categoriesLoading = false;
        state.error = payload ?? error.message;
      })
      .addCase(fetchBalance.pending, (state) => {
        state.balanceLoading = true;
        state.balanceError = null;
      })
      .addCase(fetchBalance.fulfilled, (state, { payload }) => {
        state.balanceLoading = false;
        state.totalBalance = payload;
      })
      .addCase(fetchBalance.rejected, (state, { payload, error }) => {
        state.balanceLoading = false;
        state.balanceError = payload ?? error.message;
      })
      .addCase(addTransaction.pending, pendingMutation)
      .addCase(addTransaction.fulfilled, settledMutation)
      .addCase(addTransaction.rejected, settledMutation)
      .addCase(editTransaction.pending, pendingMutation)
      .addCase(editTransaction.fulfilled, settledMutation)
      .addCase(editTransaction.rejected, settledMutation)
      .addCase(deleteTransaction.pending, pendingMutation)
      .addCase(deleteTransaction.fulfilled, (state, { payload }) => {
        state.isMutating = false;
        state.transactions = state.transactions.filter(
          ({ id }) => id !== payload,
        );
      })
      .addCase(deleteTransaction.rejected, settledMutation)
      .addCase(logOut.fulfilled, () => initialState)
      .addCase(logOut.rejected, () => initialState)
      .addCase(refreshUser.rejected, () => initialState);
  },
});

export const financeReducer = financeSlice.reducer;
