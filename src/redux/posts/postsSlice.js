import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CONFIG } from "../../config";

// Helper function to get the token
const getToken = () => localStorage.getItem("token");

// Helper function to create axios instance with auth header
const createAuthAxios = () => {
   const token = getToken();
   return axios.create({
      baseURL: CONFIG.API_URL,
      headers: {
         Authorization: `Bearer ${token}`,
         "Content-Type": "application/json",
         Accept: "application/json",
         "Access-Control-Allow-Origin": "*",
      },
   });
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async ({ page, limit }, { rejectWithValue, getState }) => {
   try {
      const authAxios = createAuthAxios();

      const response = await authAxios.get(`/posts?page=${page}&limit=${limit}`);
      console.log("fetchPosts response", response);
      if (response.data.error) {
         return rejectWithValue(response.data);
      }
      
      // Get existing post IDs
      const existingPostIds = getState().posts.items.map(post => post._id);
      
      // Filter out posts that already exist in the state
      const newPosts = response.data.posts.filter(post => !existingPostIds.includes(post._id));
      
      return { ...response.data, posts: newPosts };
   } catch (error) {
      return rejectWithValue(error.response?.data || { message: "An error occurred", error: true });
   }
});

export const createPost = createAsyncThunk("posts/createPost", async (postData, { rejectWithValue }) => {
   try {
      const authAxios = createAuthAxios();
      console.log("postData", postData);

      const response = await authAxios.post(`/posts`, postData);
      console.log("createPost response", response);

      if (response.data.error) {
         return rejectWithValue(response.data);
      }
      return response.data.data;
   } catch (error) {
      return rejectWithValue(error.response?.data || { message: "An error occurred", error: true });
   }
});

export const updatePost = createAsyncThunk("posts/updatePost", async ({ postId, postData }, { rejectWithValue }) => {
   try {
      console.log(postId, "postData", postData);

      const authAxios = createAuthAxios();
      const response = await authAxios.put(`/posts/${postId}`, postData);
      console.log("response", response);

      if (response.data.error) {
         return rejectWithValue(response.data);
      }
      return response?.data?.data;
   } catch (error) {
      return rejectWithValue(error.response?.data || { message: "An error occurred", error: true });
   }
});

export const deletePost = createAsyncThunk("posts/deletePost", async (postId, { rejectWithValue }) => {
   try {
      console.log("postId", postId);

      const authAxios = createAuthAxios();
      const response = await authAxios.delete(`/posts/${postId}`);
      console.log("response", response);

      if (response.data.error) {
         return rejectWithValue(response.data);
      }
      return postId;
   } catch (error) {
      return rejectWithValue(error.response?.data || { message: "An error occurred", error: true });
   }
});

const postsSlice = createSlice({
   name: "posts",
   initialState: {
      items: [],
      status: "idle",
      error: null,
      page: 1,
      hasMore: true,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchPosts.pending, (state) => {
            state.status = "loading";
         })
         .addCase(fetchPosts.fulfilled, (state, action) => {
            console.log("fetchPosts fulfilled", action);
            state.status = "succeeded";
            state.items = [...state.items, ...action.payload.posts];
            state.page += 1;
            state.hasMore = action.payload.posts.length > 0;
            state.error = null;
         })
         .addCase(fetchPosts.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.message;
         })
         .addCase(createPost.fulfilled, (state, action) => {
            // Check if the post already exists in the state
            const existingPostIndex = state.items.findIndex(post => post._id === action.payload._id);
            if (existingPostIndex === -1) {
               // If it doesn't exist, add it to the beginning of the array
               state.items.unshift(action.payload);
            }
         })
         .addCase(createPost.rejected, (state, action) => {
            state.error = action.payload.message;
         })
         .addCase(updatePost.fulfilled, (state, action) => {
            const index = state.items.findIndex(post => post._id === action.payload._id);
            if (index !== -1) {
               state.items[index] = action.payload;
            }
         })
         .addCase(updatePost.rejected, (state, action) => {
            state.error = action.payload.message;
         })
         .addCase(deletePost.fulfilled, (state, action) => {
            state.items = state.items.filter(post => post._id !== action.payload);
         })
         .addCase(deletePost.rejected, (state, action) => {
            state.error = action.payload.message;
         });
   },
});

export default postsSlice.reducer;
