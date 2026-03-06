import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../config';
import { toast } from 'react-toastify';
import { getItem, removeItem } from '../utils/localStorage';

// Custom error handling function
const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: config.get('API_URL'),
    prepareHeaders: headers => {
      const isLogin = api.endpoint === 'login';
      const token = getItem('token');
      if (token && !isLogin) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);
  console.log(result);
  if (result && result.error) {
    switch (result.error.status) {
      case 'FETCH_ERROR': {
        return {
          error: {
            message:
              'Either Network Error or Something went wrong. Failed to Fetch the data!',
          },
        };
      }

      case 403: {
        toast.error('You are not authorized to perform this action!', {
          autoClose: 5000,
        });

        return {
          error: {
            message: 'You are not authorized to perform this action!',
          },
        };
      }
      case 401: {
        if (location.pathname !== '/login' && location.pathname !== '/') {
          toast.error(
            'You token has expired, you will be redirected to login page. Please login again to get access!',
            { autoClose: 3000 },
          );
          setTimeout(() => {
            location.assign('/');
            localStorage.clear();
          }, 4000);
          return;
        }

        return {
          error: {
            message: result.error.data.message,
          },
        };
      }
      default: {
        const message = result.error.data.message;

        return {
          error: {
            message,
          },
        };
      }
    }
  }
  console.log(result);
  return result.data.token ? result : result.data;
};

// Base API slice
export const apiBase = createApi({
  baseQuery: baseQueryWithErrorHandling,
  refetchOnMountOrArgChange: true,
  endpoints: () => ({}), // Initial empty endpoints; will be injected later
});
