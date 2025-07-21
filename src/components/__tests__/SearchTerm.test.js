// src/components/__tests__/SearchTerm.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchTerm from '../SearchTerm';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import searchByTermReducer from '../../features/searchByTermSlice';

function renderWithStore(preloadedTerm = '') {
  const store = configureStore({
    reducer: { searchTerm: searchByTermReducer },
    preloadedState: { searchTerm: preloadedTerm },
  });

  return {
    ...render(
      <Provider store={store}>
        <SearchTerm />
      </Provider>
    ),
    store,
  };
}

describe('SearchTerm component', () => {
  test('renders input with placeholder and Clear button', () => {
    renderWithStore();
    const input = screen.getByPlaceholderText(/search posts/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
    const clearBtn = screen.getByRole('button', { name: /clear/i });
    expect(clearBtn).toBeInTheDocument();
  });

  test('typing in input updates the Redux state and the input value', () => {
    const { store } = renderWithStore('');
    const input = screen.getByPlaceholderText(/search posts/i);

    fireEvent.change(input, { target: { value: 'redux' } });
    expect(input).toHaveValue('redux');


    expect(store.getState().searchTerm).toBe('redux');
  });

  test('clicking Clear button resets the input and Redux state', () => {
    const { store } = renderWithStore('initial');
    const input = screen.getByPlaceholderText(/search posts/i);
    expect(input).toHaveValue('initial');

    const clearBtn = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearBtn);

    expect(input).toHaveValue('');
    expect(store.getState().searchTerm).toBe('');
  });
});
