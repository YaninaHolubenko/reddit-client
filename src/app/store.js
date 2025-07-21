// store.js
// Import configureStore from Redux Toolkit for easy store setup
import { configureStore } from '@reduxjs/toolkit';
// Import all slice reducers to combine them in the store
import allPostsReducer from '../features/allPostsSlice';
import commentsReducer from '../features/commentsSlice';
import postDetailReducer from '../features/postDetailSlice';
import searchByTermReducer from '../features/searchByTermSlice';
import subredditsReducer from '../features/subredditsSlice';
import selectedCategoryReducer from '../features/selectedCategorySlice';

// Create the Redux store and combine all feature reducers into a single root reducer
const store = configureStore({
  reducer: {
    // This 'reducer' object defines the main structure of our Redux store.
// Each key (e.g. 'allPosts') is a slice of the global state.
// The value (e.g. 'allPostsReducer') is the reducer function managing that slice.
// Example: 
// reducer: {
//   allPosts: allPostsReducer,
//   comments: commentsReducer
// }
// will produce a global store like:
// {
//   allPosts: { posts: [...], status: 'idle', error: null },
//   comments: [ ... ]
// }
// When you use useSelector(state => state.allPosts), 
// you're getting everything inside that 'allPosts' room.
// Redux will automatically call the correct reducer for each slice when actions are dispatched.

    allPosts: allPostsReducer,
    comments: commentsReducer,
    postDetail: postDetailReducer,
    searchTerm: searchByTermReducer,
    subreddits: subredditsReducer,
    selectedCategory: selectedCategoryReducer,
  },
});

// Export the store as default so it can be used in the Provider
export default store;