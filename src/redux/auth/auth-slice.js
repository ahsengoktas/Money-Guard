import { createSlice } from '@reduxjs/toolkit';

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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  // Register / login / logout / refresh thunks are added here in TASK-6.
});

export const authReducer = authSlice.reducer;
