// src/components/__tests__/CommentsList.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CommentsList from '../CommentsList';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import commentsReducer from '../../features/commentsSlice';

// Render the CommentsList component with a real Redux store and a preset list of comments.
// This helper lets you test how CommentsList displays different comment data for a given postId.
function renderWithStore(comments, postId = 'post1') {
  const store = configureStore({
    reducer: { comments: commentsReducer },
    preloadedState: { comments },
  });
  return render(
    <Provider store={store}>
      <CommentsList postId={postId} />
    </Provider>
  );
}

describe('CommentsList component', () => {
  it('renders "Show Comments" button initially', () => {
    renderWithStore([]);
    expect(screen.getByRole('button', { name: /show comments/i })).toBeInTheDocument();
  });

  it('toggles comments visibility when button clicked', () => {
    renderWithStore([]);
    const btn = screen.getByRole('button', { name: /show comments/i });
    expect(btn).toHaveTextContent(/show comments/i);

    fireEvent.click(btn);
    expect(screen.getByRole('button', { name: /hide comments/i })).toBeInTheDocument();

    // Since the array is empty, there should be no rendered comment regions.
    expect(screen.queryAllByRole('region')).toHaveLength(0);
  });

  it('renders comments from store when toggled', () => {
    const sample = [
      {
        id: 'c1',
        author: 'alice',
        body: 'Hello **world**',
        created_utc: 1600000000,
        parent_id: 't3_post1',
      },
      {
        id: 'c2',
        author: 'bob',
        body: 'Just a plain comment',
        created_utc: 1600001000,
        parent_id: 't3_post1',
      },
      {
        id: 'c3',
        author: 'evil',
        body: 'I should not appear',
        created_utc: 1600002000,
        parent_id: 't3_otherPost',
      },
    ];
    renderWithStore(sample);
    fireEvent.click(screen.getByRole('button', { name: /show comments/i }));

    // alice и markdown -> <strong>
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('world', { selector: 'strong' })).toBeInTheDocument();

    // bob
    expect(screen.getByText('bob')).toBeInTheDocument();
    expect(screen.getByText(/plain comment/)).toBeInTheDocument();

    // "evil" should not appear
    expect(screen.queryByText(/evil/)).toBeNull();
  });

  it('renders image when comment body contains image URL', () => {
    const imgUrl = 'https://example.com/pic.png';
    renderWithStore([
      {
        id: 'c4',
        author: 'charlie',
        body: imgUrl,
        created_utc: 1600003000,
        parent_id: 't3_post1',
      },
    ]);
    fireEvent.click(screen.getByRole('button', { name: /show comments/i }));
    const img = screen.getByAltText('Comment media');
    expect(img).toHaveAttribute('src', imgUrl);
  });

  it('renders video when comment body contains mp4 URL', () => {
    const mp4Url = 'https://media.example.com/vid.mp4';
    renderWithStore([
      {
        id: 'c5',
        author: 'dan',
        body: mp4Url,
        created_utc: 1600004000,
        parent_id: 't3_post1',
      },
    ]);
    fireEvent.click(screen.getByRole('button', { name: /show comments/i }));

   // <video> does not have an aria-role, so we just select it by tag name
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', mp4Url);
  });

  it('converts giphy|ID to gif URL', () => {
    renderWithStore([
      {
        id: 'c6',
        author: 'ellen',
        body: 'giphy|abc123',
        created_utc: 1600005000,
        parent_id: 't3_post1',
      },
    ]);
    fireEvent.click(screen.getByRole('button', { name: /show comments/i }));
    const img = screen.getByAltText('Comment media');
    expect(img).toHaveAttribute('src', 'https://media.giphy.com/media/abc123/giphy.gif');
  });
});
