// src/components/Header.jsx
import React from 'react';
// Import React Redux hooks:
// - useDispatch: returns a function that lets you send actions to the Redux store (to update global state)
// - useSelector: lets you select and read specific data from the Redux store
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, clearSearchTerm } from '../features/searchByTermSlice';
import { fetchPosts } from '../features/postsThunks';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  // Use useSelector to read the current searchTerm value from the Redux store.
  // Whenever the global searchTerm state changes, this variable will automatically update.
  const searchTerm = useSelector((state) => state.searchTerm);
  const selectedCategory = useSelector((state) => state.selectedCategory);
  // When the input value changes (user types in the search box), dispatch an action to update the searchTerm in the Redux store.
  // This will cause any components using the searchTerm from Redux to re-render with the new value.
  const handleInputChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleClear = () => {
    // Reset the searchTerm and immediately reload posts for the selected category
    dispatch(clearSearchTerm());
    // Dispatch an action to fetch posts for the currently selected category from the Reddit API
    dispatch(fetchPosts(selectedCategory));
  };


  return (
    <div className="header">
      <img
        src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
        alt="Logo"
        className="logo"
      />
      <section className="search-container">
        <input
          placeholder="Search posts..."
          type="search"
          // This "role" helps assistive technologies (like screen readers)
          role="searchbox"
          // Makes the input a "controlled component": the displayed value
          // is always kept in sync with the searchTerm from Redux state.
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button onClick={handleClear}>Clear</button>
      </section>
    </div>
  );
};

export default Header;
