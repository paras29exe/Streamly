import { createAsyncThunk } from "@reduxjs/toolkit";
import { fulfilled, rejected } from '../../utils/responses'
import AxiosInstance from "../../utils/AxiosInstance";
import { clearAccountInfo } from "../slices/AccountSlice";
import { clearUserData } from "../slices/AuthSlice";
import { clearPlaylistData } from "../slices/PlaylistSlice";

export const signup = createAsyncThunk(
    "auth/signup",
    async (data, thunkAPI) => {
        const formData = new FormData();

        formData.append('avatar', data.avatar[0]);
        formData.append('coverImage', data.coverImage[0]);
        formData.append('fullName', data.fullName);
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('password', data.password);

        try {
            const response = await AxiosInstance.post("users/register",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return fulfilled(response)

        } catch (err) {
            return thunkAPI.rejectWithValue(rejected(err));
        }
    }
)

export const login = createAsyncThunk(
    "auth/login",
    async (data, thunkAPI) => {
        const formData = new FormData();

        formData.append('username', data.username);
        formData.append('password', data.password);

        try {
            const response = await AxiosInstance.post("users/login", formData);
            return fulfilled(response);
        } catch (err) {
            // console.log(err);
            
            return thunkAPI.rejectWithValue(rejected(err))
        }
    }
)

export const loginWithGoogle = createAsyncThunk(
    "auth/loginWithGoogle",
    async (token, thunkAPI) => {
        try {
            const response = await AxiosInstance.post("users/login-with-google",
                {token },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            return fulfilled(response);
        } catch (err) {
            return thunkAPI.rejectWithValue(rejected(err))
        }
    }
)

export const autoLogin = createAsyncThunk(
    "auth/autoLogin",
    async (_, thunkAPI) => {
        try {
            const response = await AxiosInstance.post("users/refresh-the-tokens");
            return fulfilled(response);
        } catch (err) {
            return thunkAPI.rejectWithValue(rejected(err))
        }
    }
)

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            const response = await AxiosInstance.post("users/logout");
            await thunkAPI.dispatch(clearUserData())
            await thunkAPI.dispatch(clearAccountInfo())
            await thunkAPI.dispatch(clearPlaylistData())
            return fulfilled(response);
        } catch (err) {
            return thunkAPI.rejectWithValue(rejected(err))
        }
    }
)