// CategoriesList.js
import React, { useEffect } from 'react';
// Import React Redux hooks:
// - useDispatch: returns a function that lets you send actions to the Redux store (to update global state)
// - useSelector: lets you select and read specific data from the Redux store
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubreddits, selectAllSubreddits } from '../features/subredditsSlice';
import { setSelectedCategory } from '../features/selectedCategorySlice';
// Import a custom hook that wraps useNavigate from react-router-dom.
// This helps to easily mock navigation in tests.
import useAppNavigate from '../hooks/useAppNavigate';
import './CategoriesList.css';

// onCategorySelect is a prop (function) passed from the parent component (App).
// In App.js, we pass closeMenu as onCategorySelect only for mobile mode:
//   <CategoriesList onCategorySelect={closeMenu} isMobile={true} />
// This means: when a category is selected on mobile, CategoriesList can call onCategorySelect()
// to close the burger menu automatically. If not on mobile, this prop is not passed at all.
const CategoriesList = ({ onCategorySelect }) => {
  const dispatch = useDispatch();
  // useSelector allows this component to read the list of all subreddits from the global Redux state.
  // If the subreddits data changes in the store, this component will re-render automatically.
  const subreddits = useSelector(selectAllSubreddits);
  const selectedCategory = useSelector(state => state.selectedCategory);
  const navigate = useAppNavigate();

  // useEffect runs code when the component mounts or when its dependencies change.
  // Here, we use it to fetch the list of subreddits when the component is first rendered.
  useEffect(() => {
    dispatch(fetchSubreddits());
  }, [dispatch]);

  const handleCategoryClick = (subreddit) => {
    dispatch(setSelectedCategory(subreddit));
    // If 'onCategorySelect' function was passed as a prop, call it (for example, to close the mobile menu).
    // If not, do nothing (safe for desktop mode).
    if (onCategorySelect) onCategorySelect();
    navigate('/');
  };

  const formatCategoryName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div className="categories-list">
      {onCategorySelect && (
        <button className="close-menu" onClick={onCategorySelect}>
          ×
        </button>
      )}
      <h2>Subreddits</h2>
      <ul>
        {/*Render the 'Popular' category as a static list item — it's always present and not from the API.
Then, render all other categories dynamically using .map() from the subreddits data. */}
        <li
          onClick={() => handleCategoryClick('popular')}
          className={selectedCategory === 'popular' ? 'active' : ''}
        >
          Popular
        </li>
        {subreddits.map((subreddit) => (
          <li
            key={subreddit.id}
            onClick={() => handleCategoryClick(subreddit.display_name)}
            className={selectedCategory === subreddit.display_name ? 'active' : ''}
          >
            {formatCategoryName(subreddit.display_name)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesList;
