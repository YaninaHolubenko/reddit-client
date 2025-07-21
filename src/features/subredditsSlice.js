//subredditsSlice.js
//createSlice: lets you easily create reducers and actions for a feature
//createAsyncThunk: lets you write async logic (like fetching data from API) that can update the Redux state
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSubreddits = createAsyncThunk('subreddits/fetchSubreddits', async () => {
  const response = await fetch('https://corsproxy.io/?https://www.reddit.com/subreddits/popular.json');
  const data = await response.json();
  return data.data.children.map(subreddit => subreddit.data);
});

const subredditsSlice = createSlice({
  name: 'subreddits',
  initialState: [],
  reducers: {},
  // This extraReducers block handles async actions (like fetching subreddits from the API).
  // When fetchSubreddits is fulfilled (successful), we replace the state with the loaded list.
  extraReducers: (builder) => {
    builder.addCase(fetchSubreddits.fulfilled, (state, action) => {
      // When subreddits are successfully loaded from API, update the state with new data.
      return action.payload;
    });
  },
});

export const selectAllSubreddits = (state) => state.subreddits;
export default subredditsSlice.reducer;