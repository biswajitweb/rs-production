import { configureStore } from '@reduxjs/toolkit' 

import cartReducer from '../features/cart/cartSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import siteReducer from '../features/site/siteSlice';
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
    reducer: {
        site: siteReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        user: authReducer  
    }
});