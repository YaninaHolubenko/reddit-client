//subredditsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSubreddits = createAsyncThunk('subreddits/fetchSubreddits', async () => {
  const response = await fetch('https://www.reddit.com/subreddits/popular.json');
  const data = await response.json();
  return data.data.children.map(subreddit => subreddit.data);
});

const subredditsSlice = createSlice({
  name: 'subreddits',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSubreddits.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectAllSubreddits = (state) => state.subreddits;
export default subredditsSlice.reducer;