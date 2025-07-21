import subredditsReducer, { fetchSubreddits } from '../subredditsSlice';

describe('subredditsSlice', () => {
  it('should return the initial state (empty array)', () => {
    expect(subredditsReducer(undefined, {})).toEqual([]);
  });

  it('should handle fetchSubreddits.fulfilled', () => {
    const fakeSubreddits = [
      { id: '1', display_name: 'javascript' },
      { id: '2', display_name: 'reactjs' }
    ];

    const action = {
      type: fetchSubreddits.fulfilled.type,
      payload: fakeSubreddits
    };

    const newState = subredditsReducer([], action);
    expect(newState).toEqual(fakeSubreddits);
  });
});
