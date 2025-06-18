// SearchTerm.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, clearSearchTerm } from '../features/searchByTermSlice';
import './SearchTerm.css';

const SearchTerm = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector(state => state.searchTerm); // Получаем текущее значение поискового термина из Redux состояния

  const onSearchTermChanged = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const onClearSearchTerm = () => {
    dispatch(clearSearchTerm());
  };

  return (
    <section className="search-container">
      <input
        type="text"
        value={searchTerm}
        onChange={onSearchTermChanged}
        placeholder="Search posts..."
      />
      <button onClick={onClearSearchTerm}>Clear</button>
    </section>
  );
};

export default SearchTerm;