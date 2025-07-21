import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import searchByTermSlice from '../../features/searchByTermSlice';

// Mock useDispatch directly from react-redux to control dispatching actions in tests
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

import { useDispatch } from 'react-redux';

const mockDispatch = jest.fn();

beforeEach(() => {
  useDispatch.mockReturnValue(mockDispatch);
  mockDispatch.mockClear();
});

const store = configureStore({
  reducer: { searchTerm: searchByTermSlice },
});

describe('Header component', () => {
  test('renders search input and logo', () => {
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();

    const input = screen.getByRole('searchbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search posts...');
  });

  test('dispatch is called on input change', () => {
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'redux' } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'searchByTerm/setSearchTerm',
      payload: 'redux',
    });
  });

  test('clicking Clear button dispatches clearSearchTerm', () => {
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'redux' } });

    const clearButton = screen.getByText(/clear/i);
    fireEvent.click(clearButton);

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'searchByTerm/clearSearchTerm' });
  });
  test('dispatch is called when Enter is pressed in input', () => {
  render(
    <Provider store={store}>
      <Header />
    </Provider>
  );

  const input = screen.getByPlaceholderText('Search posts...');
  fireEvent.change(input, { target: { value: 'redux' } });

  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

  expect(mockDispatch).toHaveBeenCalled();
});

});
