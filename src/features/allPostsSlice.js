// src/features/allPostsSlice.js
// Import the createSlice function from Redux Toolkit.
// This function makes it easier to write Redux "slices": 
// small pieces of the global state with their own reducers and actions.
import { createSlice } from '@reduxjs/toolkit';
import { fetchPosts, fetchSearchPosts } from './postsThunks';

const allPostsSlice = createSlice({
  name: 'allPosts',
  initialState: {
    posts: [],
    status: 'idle',
    error: null,
  },
  // No regular reducers defined for this slice.
  // State changes are handled only via extraReducers (usually for async actions).
  reducers: {},
  extraReducers: builder => {
    // Fetch posts by selected category
    builder
      .addCase(fetchPosts.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
      
    // Fetch posts by search term
    builder
      .addCase(fetchSearchPosts.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchSearchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchSearchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default allPostsSlice.reducer;
