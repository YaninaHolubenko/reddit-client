//postsThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';

const cache = {};
const TTL = 300000; // 5 минут в миллисекундах

const isCacheValid = (timestamp) => {
  return (Date.now() - timestamp) < TTL;
};

export const fetchPosts = createAsyncThunk(
  'allPosts/fetchPosts',
  async (category = 'popular') => {
    const cachedData = cache[category];

    if (cachedData && isCacheValid(cachedData.timestamp)) {
      return cachedData.data;
    }

    const response = await fetch(`https://www.reddit.com/r/${category}.json`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    const posts = data.data.children.map(post => post.data);

    cache[category] = {
      data: posts,
      timestamp: Date.now()
    };

    return posts;
  }
);

export const fetchPostById = createAsyncThunk(
  'postDetail/fetchPostById',
  async (postId) => {
    const cachedData = cache[postId];

    if (cachedData && isCacheValid(cachedData.timestamp)) {
      return cachedData.data;
    }

    const response = await fetch(`https://www.reddit.com/comments/${postId}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }
    const data = await response.json();
    const post = data[0].data.children[0].data;

    cache[postId] = {
      data: post,
      timestamp: Date.now()
    };

    return post;
  }
);
