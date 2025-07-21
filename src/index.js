// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './app/App';
import './index.css';

// Find the root DOM node in index.html
const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the main application inside the root node
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);