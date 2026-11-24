import { createAsyncThunk } from '@reduxjs/toolkit';

import { walletApi, setAuthHeader, clearAuthHeader } from '../../services/api';

const getErrorMessage = (error) => {
  const message = error.response?.data?.message ?? error.message;
  return Array.isArray(message) ? message.join(', ') : String(message);
};

// POST /auth/sign-up -> { user, token }
export const register = createAsyncThunk(
  'auth/register',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await walletApi.post('/auth/sign-up', credentials);
      setAuthHeader(data.token);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// POST /auth/sign-in -> { user, token }
export const logIn = createAsyncThunk(
  'auth/logIn',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await walletApi.post('/auth/sign-in', credentials);
      setAuthHeader(data.token);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// DELETE /auth/sign-out
export const logOut = createAsyncThunk('auth/logOut', async (_, thunkAPI) => {
  try {
    await walletApi.delete('/auth/sign-out');
    clearAuthHeader();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// GET /users/current -> user (TASK-6)
// Uses the token restored by redux-persist to fetch the current user.
export const refreshUser = createAsyncThunk(
  'auth/refreshUser',
  async (_, thunkAPI) => {
    const { token } = thunkAPI.getState().auth;
    setAuthHeader(token);

    try {
      const { data } = await walletApi.get('/users/current');
      return data;
    } catch (error) {
      clearAuthHeader();
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
  {
    // Skip when there is no saved token or a refresh is already running.
    condition: (_, { getState }) => {
      const { token, isRefreshing } = getState().auth;
      return Boolean(token) && !isRefreshing;
    },
  },
);
