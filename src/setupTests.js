// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// src/setupTests.js
import '@testing-library/jest-dom';

// Override global.fetch before all tests
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: { children: [] } }),
    })
  );
});

// Restore the original fetch after all testsh
afterAll(() => {
  global.fetch.mockRestore();
});

