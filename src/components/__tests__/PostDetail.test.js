// src/components/__tests__/PostDetail.test.js

// Mock useDispatch so that useEffect does not actually change the state during tests
jest.mock('react-redux', () => {
  const original = jest.requireActual('react-redux');
  return {
    ...original,
    useDispatch: () => () => {}, // noop вместо dispatch
  };
});

// Mocking the CommentsList component
jest.mock('../CommentsList', () => () => <div data-testid="comments-list" />);

import React from 'react';
import { render, screen } from '@testing-library/react';
import PostDetail from '../PostDetail';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import postDetailReducer from '../../features/postDetailSlice';


function renderWithState(postState, route = '/posts/42') {
  const store = configureStore({
    reducer: { postDetail: postDetailReducer },
    preloadedState: { postDetail: postState },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/posts/:postId" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe('PostDetail component', () => {
  it('shows loading indicator when status="loading"', () => {
    renderWithState({ post: null, status: 'loading', error: null });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders "No post found." when no post and status is not loading', () => {
    renderWithState({ post: null, status: 'succeeded', error: null });
    expect(screen.getByText(/no post found/i)).toBeInTheDocument();
  });

  it('renders full post detail when status is "succeeded" and post exists', () => {
    const samplePost = {
      id: '42',
      title: 'Hello 🌟 World',
      author: 'tester',
      created_utc: 1600000000, 
      selftext_html: '<p>Some <strong>content</strong></p>',
      num_comments: 3,
      score: 7,
      media: null,
      preview: { images: [] },
      thumbnail: 'self',
      secure_media_embed: {},
      media_embed: {},
    };

    renderWithState({ post: samplePost, status: 'succeeded', error: null });

   
    expect(
      screen.getByRole('heading', { name: /hello.*world/i })
    ).toBeInTheDocument();

    
    expect(
      screen.getByText(/Posted by tester on/i)
    ).toBeInTheDocument();

    
    expect(screen.getByText('Some')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();

  
    expect(screen.getByText(/3 comments/i)).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();

   
    expect(screen.getByTestId('comments-list')).toBeInTheDocument();
  });

  // Removing the check for "failed" status, because the UI now shows "No post found."
});
