import { createSlice } from '@reduxjs/toolkit';
import apiAuth from '../../services/apiAuth';
import { setItem } from '../../utils/localStorage';

const authSlice = createSlice({
  initialState: {
    user: null,
    isLoading: false,
  },
  name: 'auth',
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      apiAuth.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        if (payload) {
          state.user = { ...payload.user };
          setItem('token', payload.token);
        }
      },
    );

    builder.addMatcher(apiAuth.endpoints.getUser.matchPending, state => {
      state.isLoading = true;
    });
    builder.addMatcher(
      apiAuth.endpoints.getUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user;
        state.isLoading = false;
      },
    );
    builder.addMatcher(apiAuth.endpoints.getUser.matchRejected, state => {
      state.isLoading = false;
    });
  },
});

export const { setLoading } = authSlice.actions;

export default authSlice.reducer;
