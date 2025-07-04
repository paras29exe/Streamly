import { createAsyncThunk } from "@reduxjs/toolkit";
import { fulfilled, rejected } from "../../utils/responses";
import AxiosInstance from "../../utils/AxiosInstance";
import { setUploadProgress } from "../slices/VideosSlice";
import { addVideoAfterUpload, removeVideoAfterDelete, resetUserVideos } from "../slices/AccountSlice";
import { useSearchParams } from "react-router-dom";

export const uploadVideo = createAsyncThunk(
    "videos/uploadVideo",
    async (data, thunkAPI) => {

        try {
            const formData = new FormData();
            formData.append("videoFile", data.videoFile[0]);
            formData.append("thumbnail", data.thumbnail[0]);
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("publishStatus", data.publishStatus);

            const response = await AxiosInstance.post("videos/upload-video",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        thunkAPI.dispatch(setUploadProgress(progress));
                    },
                }
            );
            
            thunkAPI.dispatch(addVideoAfterUpload(response.data))
            return fulfilled(response);
        } catch (err) {
            return thunkAPI.rejectWithValue(rejected(err));
        }
    }
)

export const updateVideoDetails = createAsyncThunk(
    "videos/updateVideoDetails",
    async ({ data, videoId }, thunkAPI) => {

        const formData = new FormData();
        data?.thumbnail?.[0] && formData.append("thumbnail", data.thumbnail?.[0]);
        data?.title && formData.append("title", data.title);
        data?.description && formData.append("description", data.description);
        data?.publishStatus && formData.append("publishStatus", data.publishStatus);


        try {
            const response = await AxiosInstance.patch("videos/update-video-details/" + videoId,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            await thunkAPI.dispatch(resetUserVideos())
            return fulfilled(response);
        } catch (err) {
            return thunkAPI.rejectWithValue(rejected(err));
        }
    }
)

export const getVideos = createAsyncThunk(
    "videos/getVideos",
    async (_, thunkAPI) => {
        try {
            const response = await AxiosInstance.get("videos/get-videos");
            return fulfilled(response);
        } catch (err) {
            return thunkAPI.rejectWithValue(rejected(err));
        }
    }
)

export const searchVideos = createAsyncThunk(
    "videos/searchVideos",
    async (query, thunkAPI) => {
        
        try {
            const response = await AxiosInstance.get("videos/get-searched-videos", {
                params: query
            });
            return fulfilled(response);
        } catch (err) {
            return thunkAPI.rejectWithValue(rejected(err));
        }
    }
)

// fetch video with id
export const getVideoById = createAsyncThunk(
    "videos/getVideo",
    async (v_id, thunkAPI) => {
        try {
            const response = await AxiosInstance.get(`videos/get-video/` + v_id);
            return fulfilled(response);
        } catch (err) {
            return thunkAPI.rejectWithValue(rejected(err));
        }
    }
)

// play video
export const playVideo = createAsyncThunk(
    "videos/playVideo",
    async (v_id, thunkAPI) => {
        try {
            const response = await AxiosInstance.get(`videos/play-video/` + v_id);
            return fulfilled(response);
        } catch (err) {
            return thunkAPI.rejectWithValue(rejected(err));
        }
    }
)

// delete video
export const deleteVideo = createAsyncThunk(
    "videos/deleteVideo",
    async (v_id, thunkAPI) => {
        try {
            const response = await AxiosInstance.delete(`/videos/delete-video/${v_id}`);
            thunkAPI.dispatch(removeVideoAfterDelete(v_id))
            return fulfilled(response);
        } catch (err) {
            return thunkAPI.rejectWithValue(rejected(err));
        }
    }
)
