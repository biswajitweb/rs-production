import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    itmes: [],
    totalQuantity: 0,
    totalAmount: 0,
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action)=>{
            const product = action.payload;
            const existingItem  = state.itmes.find((item) => item.productId == product.productId );
            if(existingItem) {
                existingItem.quantity +=1;
            } else {
                state.itmes.push({
                    ...product,
                    quantity: 1
                });
            }

            /** get total quantity */
            const totalQuantity = state.itmes.reduce((totalQuantity, item )=>{
                return totalQuantity += item.quantity;
            }, 0 );
            state.totalQuantity = totalQuantity;

            /** get total price */

            const cartTotalPrice = state.itmes.reduce((totalPrice, item)=>{
                return totalPrice += (item.price * item.quantity );
            }, 0);

            state.totalAmount = cartTotalPrice;
        },
        removeFromCart: (state, action)=>{
            const productId = action.payload;

            state.itmes = state.itmes.filter((item)=>item.productId !== productId);

            /** get total quantity */
            const totalQuantity = state.itmes.reduce((totalQuantity, item )=>{
                return totalQuantity += item.quantity;
            }, 0 );
            state.totalQuantity = totalQuantity;

            /** get total price */
            
            const cartTotalPrice = state.itmes.reduce((totalPrice, item)=>{
                return totalPrice += (item.price * item.quantity );
            }, 0);

        },
       increaseQuantity : (state, action)=>{

       },
       decreaseQuantity : (state, action)=>{

       },
       clearCart : (state)=>{
            state.itmes = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
       } 
    }
});
export default cartSlice.reducer;