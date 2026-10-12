import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { service } from "../../api/service";

const initialState = {
    address : [],
    isLoading : false,
    isError : null
};

export const allAddressList = createAsyncThunk(`/address/get`, async(userId, {rejectWithValue} )=>{
    try {
        let requestData = {
            user_id : userId
        };
        const response = await service.address.getAll(requestData);
        const addressResponse = response.data;
        return addressResponse.success === true ? addressResponse.data : [] ;
    } catch (error) {
        console.log(rejectWithValue(error.message));
    }
});

export const addressSlice = createSlice({
    name : "address",
    initialState,
    reducers : {
       
    },
    extraReducers : (builder)=>{
        builder.addCase(allAddressList.pending, (state)=>{
            state.isLoading = true;
            state.isError = null;
        }).addCase(allAddressList.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.address =action.payload;
            state.isError = null;
        }).addCase(allAddressList.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = action.payload;
        });
    }
});

export default addressSlice.reducer;