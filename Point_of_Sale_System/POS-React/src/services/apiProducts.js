import { apiBase } from './apiBase';

const apiProducts = apiBase.injectEndpoints({
  endpoints: build => ({
    // Get products
    getProducts: build.query({
      query: () => '/products',
      transformResponse: data => data?.products,
      providesTags: ['products'],
    }),

    // get product with id
    getProductWithId: build.query({
      query: id => `/products/${id}`,
      providesTags: (_, __, id) => [{ type: 'product', id }],
    }),

    // Create Product
    createProduct: build.mutation({
      query(data) {
        return {
          url: '/products/',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['products'],
    }),

    // Update product
    updateProduct: build.mutation({
      query({ id, data }) {
        return {
          url: `/products/${id}/`,
          method: 'PATCH',
          body: data,
        };
      },
      invalidatesTags: (_, __, { id }) => [
        { type: 'product', id },
        { type: 'products' },
      ],
    }),
    // Delete Product
    deleteProduct: build.mutation({
      query: id => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['products', 'deals'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductWithIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = apiProducts;
