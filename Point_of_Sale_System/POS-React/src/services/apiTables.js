import { apiBase } from './apiBase';

const apiTables = apiBase.injectEndpoints({
  endpoints: build => ({
    // Get Tables
    getTables: build.query({
      query: () => '/tables',
      transformResponse: data => data.tables,
      providesTags: ['tables'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetTablesQuery } = apiTables;
