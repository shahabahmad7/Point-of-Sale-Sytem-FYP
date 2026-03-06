import { configureStore } from '@reduxjs/toolkit';
import { apiBase } from '../services/apiBase';
import cartReducer from '../features/cart/cartSlice';
import inventoryReducer from '../features/inventories/inventorySlice';
import authReducer from '../features/authentication/authSlice';

export const store = configureStore({
  reducer: {
    [apiBase.reducerPath]: apiBase.reducer,

    cart: cartReducer,
    inventory: inventoryReducer,
    auth: authReducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiBase.middleware),
});
