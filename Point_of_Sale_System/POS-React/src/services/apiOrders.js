import { apiBase } from './apiBase';

const apiOrders = apiBase.injectEndpoints({
  endpoints: build => ({
    // Get orders
    getOrders: build.query({
      query: (last = 7) => `/orders?days_range=${last}`,
      transformResponse: data => data.orders,
      providesTags: ['orders'],
    }),

    // Get order by id
    getOrderByID: build.mutation({
      query: id => `/orders/${id}`,
      transformResponse: data => data.order,
    }),

    // Create order
    createOrder: build.mutation({
      query: data => ({
        url: '/orders/',
        method: 'POST',
        body: data,
      }),
      transformErrorResponse: data => data.order,
      invalidatesTags: ['active-orders', 'tables'],
    }),

    // Get active orders
    getActiveOrders: build.query({
      query: () => '/orders?active_only=true',
      transformResponse: data => data.orders,
      providesTags: ['active-orders'],
    }),

    // Update order
    updateOrder: build.mutation({
      query: ({ id, data }) => ({
        url: `/orders/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: data => data.order,
      invalidatesTags: ['active-orders'],
    }),

    // Get invoice
    getInvoice: build.mutation({
      query: id => ({
        url: `orders/${id}/invoice`,
        method: 'POST',
      }),
      transformResponse: data => data.order,
      invalidatesTags: ['active-orders', 'orders', 'tables'],
    }),

    // Get reports
    getReports: build.query({
      query: days => ({
        url: `orders/report?days_range=${days}`,
      }),
      transformResponse: data => data.report,
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useGetActiveOrdersQuery,
  useGetOrderByIDMutation,
  useUpdateOrderMutation,
  useGetInvoiceMutation,
  useGetReportsQuery,
} = apiOrders;
