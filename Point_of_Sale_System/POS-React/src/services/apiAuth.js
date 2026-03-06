import { toast } from 'react-toastify';
import { removeItem } from '../utils/localStorage';
import { apiBase } from './apiBase';

const apiAuth = apiBase.injectEndpoints({
  endpoints: build => ({
    getUser: build.query({
      query: () => '/users/me',
      providesTags: ['me'],
    }),
    login: build.mutation({
      query: data => ({
        url: '/users/login',
        method: 'POST',
        body: data,
      }),
    }),
    logout: build.mutation({
      query: () => ({ url: '/users/logout', method: 'POST' }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(apiBase.util.resetApiState());
          removeItem('token');
          location.assign('/');
        } catch (err) {
          toast.error(err);
        }
      },
    }),
  }),

  overrideExisting: false,
});

export const { useLoginMutation, useGetUserQuery, useLogoutMutation } = apiAuth;

export default apiAuth;
