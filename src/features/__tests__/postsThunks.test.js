// src/features/__tests__/postsThunks.test.js
import { createAsyncThunk } from '@reduxjs/toolkit';

describe('postsThunks', () => {
  let fetchPosts, fetchPostById;
  let originalFetch;

  beforeEach(() => {
   // Reset modules to clear the internal cache
    jest.resetModules();

   // Save and mock fetch
    originalFetch = global.fetch;
    global.fetch = jest.fn();

    // Re-import our thunks
    const thunks = require('../postsThunks');
    fetchPosts = thunks.fetchPosts;
    fetchPostById = thunks.fetchPostById;
  });

  afterEach(() => {
    // Restore the original fetch
    global.fetch = originalFetch;
  });

  describe('fetchPosts', () => {
    it('dispatches pending and fulfilled on a successful request', async () => {
      const sampleResponse = {
        data: {
          children: [
            { data: { id: 'p1', title: 'Post 1' } },
          ],
        },
      };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(sampleResponse),
      });

      const dispatch = jest.fn();
      await fetchPosts('cats')(dispatch, () => ({}), undefined);

      // 1) pending
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ type: fetchPosts.pending.type })
      );
      // 2) fulfilled + correct payload
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: fetchPosts.fulfilled.type,
          payload: [{ id: 'p1', title: 'Post 1' }],
        })
      );
    });

    it('dispatches pending and rejected on a network error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Gateway',
      });

      const dispatch = jest.fn();
      await fetchPosts('dogs')(dispatch, () => ({}), undefined);

      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ type: fetchPosts.pending.type })
      );
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: fetchPosts.rejected.type,
          error: expect.objectContaining({
            message: 'Network response was not ok: Bad Gateway',
          }),
        })
      );
    });
  });

  describe('fetchPostById', () => {
    it('dispatches pending and fulfilled on a successful request', async () => {
     // The first element of the Reddit array contains the post data
      const sampleDetail = [
        {
          data: {
            children: [
              { data: { id: 'p42', body: 'Hello' } }
            ]
          }
        },
        {} // The second part is comments, which are not important to us
      ];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(sampleDetail),
      });

      const dispatch = jest.fn();
      await fetchPostById('p42')(dispatch, () => ({}), undefined);

      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ type: fetchPostById.pending.type })
      );
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: fetchPostById.fulfilled.type,
          payload: { id: 'p42', body: 'Hello' },
        })
      );
    });

    it('dispatches pending and rejected on a 404', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      const dispatch = jest.fn();
      await fetchPostById('nope')(dispatch, () => ({}), undefined);

      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ type: fetchPostById.pending.type })
      );
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: fetchPostById.rejected.type,
          error: expect.objectContaining({
            message: 'Failed to fetch post: Not Found',
          }),
        })
      );
    });
  });
});
