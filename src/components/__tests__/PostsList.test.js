// src/components/__tests__/PostsList.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PostsList from '../PostsList';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

// 1) Mock the thunk to prevent actual data fetching during the test.
// This means fetchPosts just returns a no-operation function.
jest.mock('../../features/postsThunks', () => ({
  fetchPosts: () => () => {},
}));

// 2) Mock useNavigate so that navigation in tests does nothing (no errors, no side effects).
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn(),
  };
});

/**
 * Helper to render <PostsList /> with a real Redux store and router.
 * @param {{ posts: any[], status: string, error: string|null }} allPostsState - The mock state for allPosts
 */
function renderWithStore(allPostsState) {
  const store = configureStore({
    reducer: {
      // Reducer keys must match those used in your selectors and code.
      allPosts: (state = allPostsState) => state,
      selectedCategory: (state = '/r/reactjs') => state,
    },
    preloadedState: {
      allPosts: allPostsState,
      selectedCategory: '/r/reactjs',
    },
  });

  return render(
    <Provider store={store}>
      {/* MemoryRouter simulates browser routes for testing. */}
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<PostsList />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

// Test that the loading indicator shows when status is "loading".
test('shows loading indicator when status="loading"', async () => {
  renderWithStore({ posts: [], status: 'loading', error: null });
  // waitFor waits for any React state updates before asserting
  await waitFor(() => {
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});

// Test that a list of posts renders when status is "succeeded".
test('renders list of posts when status="succeeded"', async () => {
  const sample = [
    {
      id: '1',
      title: 'Test Post',
      author: 'tester',
      num_comments: 7,
      score: 42,
      preview: { images: [{ source: { url: 'https://example.com/img.jpg' } }] },
      thumbnail: 'default',
    },
  ];

  renderWithStore({ posts: sample, status: 'succeeded', error: null });

  // All assertions are inside waitFor to ensure all UI updates are finished.
  await waitFor(() => {
    // Twemoji may split the title into separate nodes, so we search by role
    expect(
      screen.getByRole('heading', { name: /Test Post/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/tester/i)).toBeInTheDocument();
    expect(screen.getByText(/7 comments/i)).toBeInTheDocument();
  });
});
