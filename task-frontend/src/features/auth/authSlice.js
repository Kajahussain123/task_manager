import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
};

// Register
export const registerUser = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
    try {
        const res = await API.post("/auth/register", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

// Login
export const loginUser = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
    try {
        const res = await API.post("/auth/login", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
                state.loading = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
                state.loading = false;
            })
            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state) => { state.loading = true; state.error = null; }
            )
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action) => { state.loading = false; state.error = action.payload?.message || "Error"; }
            );
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
