import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalItems: 0
}

export const wishlistSlice =  createSlice({
    name: "wishlist",
    initialState,
    reducers: {

    }
});

export default wishlistSlice.reducer;