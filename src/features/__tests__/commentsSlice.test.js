import commentsReducer, { fetchCommentsByPostId, selectCommentsByPostId } from '../commentsSlice';

describe('commentsSlice', () => {
  it('should return the initial state (empty array)', () => {
    expect(commentsReducer(undefined, {})).toEqual([]);
  });

  it('should handle fetchCommentsByPostId.fulfilled', () => {
    const fakeComments = [
      { id: '1', body: 'First!', parent_id: 't3_abc123' },
      { id: '2', body: 'Second!', parent_id: 't3_abc123' },
      { id: '3', body: 'Unrelated', parent_id: 't3_xyz789' }
    ];

    const action = {
      type: fetchCommentsByPostId.fulfilled.type,
      payload: fakeComments
    };

    const newState = commentsReducer([], action);
    expect(newState).toEqual(fakeComments);
  });

  it('should select comments by postId using selector', () => {
    const state = {
      comments: [
        { id: '1', body: 'First', parent_id: 't3_abc123' },
        { id: '2', body: 'Second', parent_id: 't3_abc123' },
        { id: '3', body: 'Third', parent_id: 't3_xyz789' }
      ]
    };

    const selected = selectCommentsByPostId(state, 'abc123');
    expect(selected).toEqual([
      { id: '1', body: 'First', parent_id: 't3_abc123' },
      { id: '2', body: 'Second', parent_id: 't3_abc123' }
    ]);
  });
});
