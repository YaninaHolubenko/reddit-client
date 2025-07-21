// commentsSlice.js
// Import createSlice to define a Redux slice and createAsyncThunk to handle async logic (e.g., fetching comments from an API)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Import createSelector to create efficient, memoized selectors for Redux state
import { createSelector } from 'reselect';

// Async thunk action creator for fetching comments by post ID from Reddit API.
// - Makes an HTTP request to Reddit to get comments for the given postId.
// - Extracts and returns an array of comment objects from the response.
// This thunk will automatically dispatch pending, fulfilled, and rejected actions
// that you can handle in your slice's extraReducers.
export const fetchCommentsByPostId = createAsyncThunk(
  'comments/fetchCommentsByPostId',
  async (postId) => {
    const response = await fetch(`https://corsproxy.io/?https://www.reddit.com/comments/${postId}.json`);
    const data = await response.json();
     // Reddit returns comments in the second element of the returned array (data[1])
    return data[1].data.children.map((comment) => comment.data);
  }
);

// Create a Redux slice for managing the comments state.
// - The state is just an array of comments (initialState: [])
// - No regular reducers here (reducers: {})
// - We listen for the 'fulfilled' action from fetchCommentsByPostId.
//   When comments are successfully loaded, we replace the state with the new array of comments.
const commentsSlice = createSlice({
  name: 'comments',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
       // Replace the comments state with the loaded comments
      return action.payload;
    });
  },
});

// Memoized selector
const selectComments = (state) => state.comments;

// Memoized selector to get only the comments for a specific post.
// - The first argument array tells reselect what parts of state or arguments to track:
//   - selectComments: gets the comments array from the state
//   - (_, postId) => postId: grabs the postId argument passed to the selector
// - The result function receives both comments and postId, and filters only those comments
//   whose parent_id matches the post's unique id.
// This makes getting comments for a single post efficient and prevents unnecessary re-renders.
export const selectCommentsByPostId = createSelector(
  [selectComments, (_, postId) => postId],
  (comments, postId) => comments.filter((comment) => comment.parent_id === `t3_${postId}`)
);

export default commentsSlice.reducer;
