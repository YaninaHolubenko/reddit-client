// src/components/__tests__/CategoriesList.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoriesList from '../CategoriesList';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import subredditsReducer, { fetchSubreddits } from '../../features/subredditsSlice';
import selectedCategoryReducer, { setSelectedCategory } from '../../features/selectedCategorySlice';

const sampleSubs = [
  { id: '1', display_name: 'reactjs' },
  { id: '2', display_name: 'javascript' },
];

// Mock useNavigate so no real navigation happens in tests; allows test-specific overrides.
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn(),
  };
});

// Creates a Redux store with given subreddits and selectedCategory for testing.
// Lets you test components in a specific state, as if the app was running.
function renderWithState(subreddits, selectedCategory = 'popular', onCategorySelect) {
  const store = configureStore({
    reducer: {
      subreddits: subredditsReducer,
      selectedCategory: selectedCategoryReducer,
    },
    preloadedState: {
      subreddits,
      selectedCategory,
    },
  });

  return render(
    <Provider store={store}>
      <CategoriesList onCategorySelect={onCategorySelect} />
    </Provider>
  );
}

test('renders heading and list items', () => {
  renderWithState(sampleSubs, 'popular');

  // Heading
  expect(screen.getByRole('heading', { name: /subreddits/i })).toBeInTheDocument();

  // // "Popular" static category is rendered 
  expect(screen.getByText('Popular')).toBeInTheDocument();

  // All categories from sampleSubs should be displayed
  sampleSubs.forEach(sub => {
    const label = sub.display_name.charAt(0).toUpperCase() + sub.display_name.slice(1);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});

test('highlights the active category', () => {
  renderWithState(sampleSubs, 'reactjs');

  const activeLi = screen.getByText(/reactjs/i).closest('li');
  expect(activeLi).toHaveClass('active');
});

test('clicking on a category dispatches setSelectedCategory, navigates and calls onCategorySelect', () => {
  // Mock useNavigate to test navigation on category click
  const navigate = jest.fn();
  jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);

  const onSelect = jest.fn();
  renderWithState(sampleSubs, 'popular', onSelect);

  // Simulate user clicking the "Javascript" category
  fireEvent.click(screen.getByText('Javascript'));

 // The onCategorySelect function should be called after click
  expect(onSelect).toHaveBeenCalled();

 
  expect(navigate).toHaveBeenCalledWith('/');

});

test('renders close button only when onCategorySelect is provided', () => {
  renderWithState(sampleSubs, 'popular');
  // If onCategorySelect is not provided, the close "×" button should not appear
  expect(screen.queryByRole('button', { name: '×' })).toBeNull();

 
  renderWithState(sampleSubs, 'popular', () => {});
  expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
});
