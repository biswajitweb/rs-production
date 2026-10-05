import { createSlice } from "@reduxjs/toolkit";
import { decryptData } from "../../utils/encryption";


const initialState = {
    authToken: sessionStorage.getItem('auth' || ''),
    role : sessionStorage.getItem('role' || ''),
    loading: false,
    error: null
};

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers: {
        loginStart : (state)=>{
            state.loading = true,
            state.error = null;
        },
        loginSuccess: (state, action) => {
            const { auth, role } = action.payload;
            
            state.authToken = auth;
            state.role = role;
            state.loading = false;
            state.error = null;
            
            sessionStorage.setItem("auth", auth);
            sessionStorage.setItem("role", role);
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.authToken = null;
            state.role = "";
            state.loading = false;
            state.error = null;
            sessionStorage.removeItem("auth");
            sessionStorage.removeItem("role");
        }
    }
});

export const {
    loginStart, 
    loginSuccess, 
    loginFailure, 
    logout
} = authSlice.actions;

export default authSlice.reducer;
