
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {service} from '../../api/service';

const initialState = {
    isSiteLoding: false,
    info : [],
    isSiteError : null
};

export const getSiteInfo = createAsyncThunk(`/site/info`, async(_, {rejectWithValue})=>{
    try {
        const response = await service.site.getInfo();
        return response.data;
    } catch (error) {
        console.log(rejectWithValue(error.message));
    }
});

export const siteSlice = createSlice({
    name: "site",
    initialState,
    reducers: {

    },
    extraReducers: (builder)=>{
        builder.addCase( getSiteInfo.pending, (state)=>{
            state.isSiteLoding = true;
        }).addCase(getSiteInfo.fulfilled, (state, action)=>{
            state.isSiteLoding = false;
            state.info = action.payload;
        }).addCase(getSiteInfo.rejected, (state)=>{
            
            state.isSiteLoding = false;
            state.isSiteError = state.action;
        });
    }

});

export default siteSlice.reducer;