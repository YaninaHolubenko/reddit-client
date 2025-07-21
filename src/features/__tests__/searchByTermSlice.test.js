import searchByTermReducer, { setSearchTerm, clearSearchTerm } from '../searchByTermSlice';

describe('searchByTermSlice', () => {
  it('should return the initial state', () => {
    expect(searchByTermReducer(undefined, {})).toBe('');
  });

  it('should handle setSearchTerm', () => {
    const action = setSearchTerm('react');
    const state = searchByTermReducer('', action);
    expect(state).toBe('react');
  });

  it('should handle clearSearchTerm', () => {
    const action = clearSearchTerm();
    const state = searchByTermReducer('react', action);
    expect(state).toBe('');
  });
});
