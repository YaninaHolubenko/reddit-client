import selectedCategoryReducer, { setSelectedCategory } from '../selectedCategorySlice';

describe('selectedCategorySlice', () => {
  it('should return the initial state', () => {
    expect(selectedCategoryReducer(undefined, {})).toBe('popular');
  });

  it('should handle setSelectedCategory', () => {
    const action = setSelectedCategory('javascript');
    const newState = selectedCategoryReducer('popular', action);
    expect(newState).toBe('javascript');
  });
});
