import {
  createSlice,
  isPending,
  isFulfilled,
  isRejected,
} from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  pendingRequestIds: [],
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state, { meta }) => {
        if (!state.pendingRequestIds.includes(meta.requestId)) {
          state.pendingRequestIds.push(meta.requestId);
        }
        state.isLoading = state.pendingRequestIds.length > 0;
      })
      .addMatcher(
        (action) => isFulfilled(action) || isRejected(action),
        (state, { meta }) => {
          state.pendingRequestIds = state.pendingRequestIds.filter(
            (id) => id !== meta.requestId,
          );
          state.isLoading = state.pendingRequestIds.length > 0;
        },
      );
  },
});

export const globalReducer = globalSlice.reducer;
