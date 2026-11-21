import { createSlice } from '@reduxjs/toolkit';

import { register, logIn, logOut, refreshUser } from './auth-operations';

const initialState = {
  user: {
    id: null,
    username: null,
    email: null,
    balance: 0,
  },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
};

const handleAuthSuccess = (state, { payload }) => {
  state.user = payload.user;
  state.token = payload.token;
  state.isLoggedIn = true;
};

const resetAuth = () => initialState;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, handleAuthSuccess)
      .addCase(logIn.fulfilled, handleAuthSuccess)
      // The session is cleared locally even if the server request fails.
      .addCase(logOut.fulfilled, resetAuth)
      .addCase(logOut.rejected, resetAuth)
      .addCase(refreshUser.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshUser.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      // An invalid or expired token is dropped so the user goes back to login.
      .addCase(refreshUser.rejected, resetAuth);
  },
});

export const authReducer = authSlice.reducer;
