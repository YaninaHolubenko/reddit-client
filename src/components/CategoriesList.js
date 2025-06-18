// CategoriesList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubreddits, selectAllSubreddits } from '../features/subredditsSlice';
import { setSelectedCategory } from '../features/selectedCategorySlice';
import { useNavigate } from 'react-router-dom';
import './CategoriesList.css';

const CategoriesList = () => {
  const dispatch = useDispatch();
  const subreddits = useSelector(selectAllSubreddits);
  const selectedCategory = useSelector(state => state.selectedCategory);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSubreddits());
  }, [dispatch]);

  const handleCategoryClick = (subreddit) => {
    dispatch(setSelectedCategory(subreddit));
    navigate('/'); // Перейти на главную страницу для отображения списка постов
  };

  const formatCategoryName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div className="categories-list">
      <h2>Subreddits</h2>
      <ul>
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