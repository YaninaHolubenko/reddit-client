// src/features/postsThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';

// Local cache for responses with TTL
const cache = {};
const TTL = 300000; // 5 minutes in milliseconds

// Check if cached timestamp is still valid
const isCacheValid = (timestamp) => (Date.now() - timestamp) < TTL;

// Fetch posts by category (default: "popular")
export const fetchPosts = createAsyncThunk(
  'allPosts/fetchPosts',
  async (category = 'popular') => {
    const key = `category:${category}`;
    const cached = cache[key];
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    const response = await fetch(`https://corsproxy.io/?https://www.reddit.com/r/${category}.json`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const json = await response.json();
    const posts = json.data.children.map(item => item.data);
    cache[key] = { data: posts, timestamp: Date.now() };
    return posts;
  }
);

// Fetch search results by term
export const fetchSearchPosts = createAsyncThunk(
  'allPosts/fetchSearchPosts',
  async (searchTerm) => {
    const key = `search:${searchTerm}`;
    const cached = cache[key];
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    const encoded = encodeURIComponent(searchTerm);
    const response = await fetch(`https://corsproxy.io/?https://www.reddit.com/search.json?q=${encoded}`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const json = await response.json();
    const posts = json.data.children.map(item => item.data);
    cache[key] = { data: posts, timestamp: Date.now() };
    return posts;
  }
);

// Fetch a single post by ID
export const fetchPostById = createAsyncThunk(
  'postDetail/fetchPostById',
  async (postId) => {
    const key = `post:${postId}`;
    const cached = cache[key];
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    const response = await fetch(`https://corsproxy.io/?https://www.reddit.com/comments/${postId}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }
    const json = await response.json();
    const post = json[0].data.children[0].data;
    cache[key] = { data: post, timestamp: Date.now() };
    return post;
  }
);
export { cache };