//postDetailSlice.js
import { createSlice } from '@reduxjs/toolkit';
// Import the async thunk for fetching a post by ID.
import { fetchPostById } from './postsThunks';

// Create a slice for the detailed state of a single post.
const postDetailSlice = createSlice({
  name: 'postDetail',
  // The initial state: no post loaded, not loading, no error.
  initialState: {
    post: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    // Clears the post detail state (e.g., when navigating away or switching posts).
    clearPostDetail: (state) => {
      state.post = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.post = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export the action to clear the post detail state.
export const { clearPostDetail } = postDetailSlice.actions;

// Selector to get the current post detail from the Redux state.
export const selectPostById = (state, postId) => state.postDetail.post;

// Export the reducer as default.
export default postDetailSlice.reducer;
export { fetchPostById };