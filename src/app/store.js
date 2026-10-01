import { configureStore } from '@reduxjs/toolkit' 

import cartReducer from '../features/cart/cartSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import siteReducer from '../features/site/siteSlice';

export const store = configureStore({
    reducer: {
        site: siteReducer,
        cart: cartReducer,
        wishlist: wishlistReducer  
    }
});