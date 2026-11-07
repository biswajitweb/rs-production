import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { API_PREFIX } from "../../api/constants";

const initialState = {
    categories : [],
    isLoading : false,
    isError : null
}


export const getAllCategories =  createAsyncThunk( "/categories", async(_, {rejectWithValue})=>{
    try {
        const response = await axiosInstance.get(`${API_PREFIX}product-categories`);
        const catReponse = response.data;
        let categoriesArray = catReponse?.data || [];
        
        let buildCategoryTree = []; 
        if(Array.isArray(categoriesArray) && categoriesArray.length > 0) {
                const parentCategories = categoriesArray.filter(
                    (category) => category.parent === 0
                );
                buildCategoryTree = categoriesArray
                .filter((category) => category.parent !== 0)
                .filter((category) => category.count > 0 )
                .map((category)=>{
                    const parent = parentCategories.find(
                        (item) => item.id === category.parent
                    );
                    return {
                        ...category,
                        parent_slug: parent?.slug || null,
                    }
                }).sort((a, b) => a.id - b.id);

            }
        return buildCategoryTree || [];
    } catch (error) {
        if(error) {
            console.log(rejectWithValue(error.message));
        }
    }
})

export const categoriesSlice = createSlice({
    name : "categories",
    initialState,
    reducers : {},
    extraReducers : (builder)=>{
        builder.addCase(getAllCategories.pending, (state)=>{
            state.isLoading = true;
        }).addCase(getAllCategories.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.categories = action.payload;
        }).addCase(getAllCategories.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = action.payload;
        });
    }
});

export default categoriesSlice.reducer;
