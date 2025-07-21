//postsSelectors.js
// 'createSelector' helps you create memoized selectors for Redux state.
// Memoized selectors only recalculate when their inputs change, making your app more efficient.
import { createSelector } from 'reselect';

// Select the entire 'allPosts' state slice from the Redux store.
const selectAllPostsState = state => state.allPosts;

// Selector: returns the array of all posts.
export const selectAllPosts = createSelector(
  [selectAllPostsState],
  allPosts => allPosts.posts
);

export const selectPostsStatus = createSelector(
  [selectAllPostsState],
  allPosts => allPosts.status
);

export const selectPostsError = createSelector(
  [selectAllPostsState],
  allPosts => allPosts.error
);

// Selector: returns the filtered posts based on the search term.
// If the search term is empty, return all posts. Otherwise, filter by title.
export const selectFilteredPosts = createSelector(
  [selectAllPosts, state => state.searchTerm],
  (posts, searchTerm) => {
    if (!searchTerm) return posts;
    return posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
);