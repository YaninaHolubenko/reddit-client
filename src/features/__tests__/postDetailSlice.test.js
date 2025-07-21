import postDetailReducer, {
  fetchPostById,
  clearPostDetail
} from '../postDetailSlice';

describe('postDetailSlice', () => {
  const initialState = {
    post: null,
    status: 'idle',
    error: null,
  };

  it('should return the initial state', () => {
    expect(postDetailReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle fetchPostById.pending', () => {
    const action = { type: fetchPostById.pending.type };
    const state = postDetailReducer(initialState, action);
    expect(state.status).toBe('loading');
  });

  it('should handle fetchPostById.fulfilled', () => {
    const fakePost = { id: 'abc123', title: 'Test post' };
    const action = {
      type: fetchPostById.fulfilled.type,
      payload: fakePost
    };
    const state = postDetailReducer(initialState, action);
    expect(state.post).toEqual(fakePost);
    expect(state.status).toBe('succeeded');
  });

  it('should handle fetchPostById.rejected', () => {
    const action = {
      type: fetchPostById.rejected.type,
      error: { message: 'Failed to load' }
    };
    const state = postDetailReducer(initialState, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Failed to load');
  });

  it('should handle clearPostDetail', () => {
    const modifiedState = {
      post: { id: 'abc123', title: 'Test post' },
      status: 'succeeded',
      error: null
    };
    const action = clearPostDetail();
    const state = postDetailReducer(modifiedState, action);
    expect(state).toEqual(initialState);
  });
});
