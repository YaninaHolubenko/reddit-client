//postDetailSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchPostById } from './postsThunks';

const postDetailSlice = createSlice({
  name: 'postDetail',
  initialState: {
    post: null,
    status: 'idle',
    error: null,
  },
  reducers: {
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

export const { clearPostDetail } = postDetailSlice.actions;

export const selectPostById = (state, postId) => state.postDetail.post;

export default postDetailSlice.reducer;
export { fetchPostById };