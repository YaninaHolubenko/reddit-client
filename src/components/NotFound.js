import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="not-found">
    <h2>404: Page Not Found</h2>
    <p>Sorry, the page you’re looking for doesn’t exist.</p>
    <Link to="/">Go back home</Link>
  </div>
);

export default NotFound;
