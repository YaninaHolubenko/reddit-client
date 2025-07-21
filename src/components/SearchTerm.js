// SearchTerm.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, clearSearchTerm } from '../features/searchByTermSlice';
import './SearchTerm.css';

const SearchTerm = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector(state => state.searchTerm); // Get the current search term value from the Redux state
  const onSearchTermChanged = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const onClearSearchTerm = () => {
    dispatch(clearSearchTerm());
  };

  return (
    <section className="search-container">
      <input
        type="search"
        value={searchTerm}
        onChange={onSearchTermChanged}
        placeholder="Search posts..."
      />
      <button onClick={onClearSearchTerm}>Clear</button>
    </section>
  );
};

export default SearchTerm;