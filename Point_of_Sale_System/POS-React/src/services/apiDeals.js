import { apiBase } from './apiBase';

const apiDeals = apiBase.injectEndpoints({
  endpoints: build => ({
    getDeals: build.query({
      query: () => '/deals/',
      transformResponse: data => data.deals,
      providesTags: ['deals'],
    }),
    getDealWithId: build.query({
      query: id => `/deals/${id}`,
      transformResponse: data => data.deal,
      providesTags: (_, __, id) => [{ type: 'deal', id }],
    }),
    createDeal: build.mutation({
      query: data => ({ url: '/deals/', method: 'POST', body: data }),
      invalidatesTags: ['deals'],
    }),
    updateDeal: build.mutation({
      query: ({ id, data }) => ({
        url: `/deals/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'deal', id },
        { type: 'deals' },
      ],
    }),
    deleteDeal: build.mutation({
      query: id => ({ url: `/deals/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['deals'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDealsQuery,
  useCreateDealMutation,
  useDeleteDealMutation,
  useGetDealWithIdQuery,
  useUpdateDealMutation,
} = apiDeals;
