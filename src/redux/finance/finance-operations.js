import { createAsyncThunk } from '@reduxjs/toolkit';
import { walletApi } from '../../services/api';
// Finans işlemleri ortak API istemcisi üzerinden gerçekleştirilir.
// Kimlik doğrulama ve token yönetimi Auth modülü tarafından sağlanır.

const getErrorMessage = (error) => {
  const message = error.response?.data?.message ?? error.message;
  return Array.isArray(message) ? message.join(', ') : String(message);
};

export const fetchTransactions = createAsyncThunk(
  'finance/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await walletApi.get('/transactions');
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchCategories = createAsyncThunk(
  'finance/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await walletApi.get('/transaction-categories');
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchBalance = createAsyncThunk(
  'finance/fetchBalance',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await walletApi.get('/users/current');
      return data.balance;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const addTransaction = createAsyncThunk(
  'finance/addTransaction',
  async (transaction, { rejectWithValue }) => {
    try {
      const { data } = await walletApi.post('/transactions', transaction);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const editTransaction = createAsyncThunk(
  'finance/editTransaction',
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const { data } = await walletApi.patch(`/transactions/${id}`, values);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteTransaction = createAsyncThunk(
  'finance/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await walletApi.delete(`/transactions/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
