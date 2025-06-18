//postsSelectors.js
import { createSelector } from 'reselect';

const selectAllPostsState = state => state.allPosts;

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

export const selectFilteredPosts = createSelector(
  [selectAllPosts, state => state.searchTerm],
  (posts, searchTerm) => {
    if (!searchTerm) return posts;
    return posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
);