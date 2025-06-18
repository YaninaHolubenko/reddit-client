//commentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCommentsByPostId = createAsyncThunk(
  'comments/fetchCommentsByPostId',
  async (postId) => {
    const response = await fetch(`https://www.reddit.com/comments/${postId}.json`);
    const data = await response.json();
    return data[1].data.children.map((comment) => comment.data);
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectCommentsByPostId = (state, postId) =>
  state.comments.filter((comment) => comment.parent_id === `t3_${postId}`);

export default commentsSlice.reducer;


