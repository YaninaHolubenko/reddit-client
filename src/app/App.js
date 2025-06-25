import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../components/Header';
import PostsList from '../components/PostsList';
import PostDetail from '../components/PostDetail';
import CategoriesList from '../components/CategoriesList';
import BurgerMenu from '../components/BurgerMenu';
import '../index.css';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <Router>
      <div className="App">
        <Header />
        {isMobile && <BurgerMenu toggleMenu={toggleMenu} />}
        <div className="main-content">
          {!isMobile && (
            <div className="categories-container desktop">
              <CategoriesList isMobile={false} />
            </div>
          )}

          <div className="posts-container">
            {isMobile && (
              <div className={`categories-container mobile${menuOpen ? ' open' : ''}`}>
                <CategoriesList onCategorySelect={closeMenu} isMobile={true} />
              </div>
            )}

            <Routes>
              <Route path="/" element={<PostsList />} />
              <Route path="/posts/:postId" element={<PostDetail />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
