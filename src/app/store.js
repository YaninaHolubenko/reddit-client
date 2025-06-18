// store.js
import { configureStore } from '@reduxjs/toolkit';
import allPostsReducer from '../features/allPostsSlice';
import commentsReducer from '../features/commentsSlice';
import postDetailReducer from '../features/postDetailSlice';
import searchByTermReducer from '../features/searchByTermSlice';
import subredditsReducer from '../features/subredditsSlice';
import selectedCategoryReducer from '../features/selectedCategorySlice';

const store = configureStore({
  reducer: {
    allPosts: allPostsReducer,
    comments: commentsReducer,
    postDetail: postDetailReducer,
    searchTerm: searchByTermReducer,
    subreddits: subredditsReducer,
    selectedCategory: selectedCategoryReducer,
  },
});

export default store;