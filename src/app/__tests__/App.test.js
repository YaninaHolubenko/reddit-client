//App.test.js
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import store from '../store';

// Simulate window resizing with act() wrapper
function resizeTo(width) {
  act(() => {
    window.innerWidth = width;
    window.dispatchEvent(new Event('resize'));
  });
}

describe('<App /> integration', () => {
  afterEach(() => {
    // Reset window size and route after each test
    resizeTo(1024);
    window.history.pushState({}, '', '/');
  });

  it('shows desktop CategoriesList and hides burger on wide screens', () => {
    resizeTo(1024);
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // On wide screens, the burger menu button is not rendered
    expect(
      screen.queryByRole('button', { name: /toggle menu/i })
    ).toBeNull();

    // The "Subreddits" heading is visible
    expect(
      screen.getByRole('heading', { name: /subreddits/i })
    ).toBeInTheDocument();
  });

  it('shows burger and toggles mobile CategoriesList on narrow screens', () => {
    resizeTo(500);
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // On a narrow screen, the burger menu button appears
    const toggleBtn = screen.getByRole('button', { name: /toggle menu/i });
    expect(toggleBtn).toBeInTheDocument();

    // The categories list is hidden by default
    expect(
      screen.queryByRole('heading', { name: /subreddits/i })
    ).toBeNull();

    // Clicking the burger menu makes the categories menu appear
    fireEvent.click(toggleBtn);
    expect(
      screen.getByRole('heading', { name: /subreddits/i })
    ).toBeInTheDocument();

    // Close the menu by clicking the "×" button inside CategoriesList
    const closeBtn = screen.getByRole('button', { name: /×/ });
    fireEvent.click(closeBtn);
    expect(
      screen.queryByRole('heading', { name: /subreddits/i })
    ).toBeNull();
  });

  it('renders 404 page on unknown route', () => {
    // Navigate to a non-existent route
    window.history.pushState({}, '', '/some/random/path');
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // The heading of the 404 (Not Found) page
    expect(
      screen.getByRole('heading', { name: /404: page not found/i })
    ).toBeInTheDocument();

    // The "Go back home" link
    expect(
      screen.getByRole('link', { name: /go back home/i })
    ).toHaveAttribute('href', '/');
  });
});
