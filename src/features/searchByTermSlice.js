// searchByTermSlice.js
import { createSlice } from '@reduxjs/toolkit';

// This slice manages the search term state for the app.
// - `name` gives this slice a unique key in the Redux store.
// - `initialState` is an empty string because the search box starts empty.
// - The `reducers` object defines two actions:
//    - setSearchTerm: takes the new value from the action payload and sets it as the search term.
//    - clearSearchTerm: resets the search term to an empty string (useful when the user clears the search box).
const searchByTermSlice = createSlice({
  name: 'searchByTerm',
  initialState: '',
  reducers: {
    setSearchTerm: (state, action) => action.payload,
    clearSearchTerm: () => '',
  },
});

export const { setSearchTerm, clearSearchTerm } = searchByTermSlice.actions;
export const searchByTermReducer = searchByTermSlice.reducer;

export default searchByTermReducer;