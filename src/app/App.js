// src/app/App.js
// useState: lets this component remember a value and update it
// useEffect: lets this component run some code after render, or when dependencies change
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../components/Header';
import PostsList from '../components/PostsList';
import PostDetail from '../components/PostDetail';
import CategoriesList from '../components/CategoriesList';
import BurgerMenu from '../components/BurgerMenu';
import NotFound from '../components/NotFound';
import '../index.css';

function App() {
  // window.innerWidth returns the number of pixels in the width of the browser window.
  // Set up a piece of state to track if the app is in "mobile" mode
  // (true if the window is 768px wide or less)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // Track if the mobile menu is open (used only on small screens)
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // When the window is resized, check again if we should switch between mobile and desktop mode.
      // This keeps isMobile always up to date, not just on first load.
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    // Listen for the browser window being resized.
    // When the window size changes, call handleResize()
    // to update the isMobile state and close the menu if needed.
    window.addEventListener('resize', handleResize);
    // Clean up: remove the 'resize' event listener when the component unmounts
    // This prevents memory leaks and unnecessary function calls
    return () => window.removeEventListener('resize', handleResize);

  }, []); // <-- Empty array means this effect runs only once, when the component mounts.
  // This prevents the effect from running on every render.
  // If you add dependencies inside the array, the effect will re-run when they change.

  // Toggles the menu open/closed state.
  // If menuOpen is true, this will set it to false (close the menu).
  // If menuOpen is false, this will set it to true (open the menu).
  const toggleMenu = () => setMenuOpen(open => !open);
  const closeMenu = () => setMenuOpen(false);

  return (
    <Router>
      <div className="App">
        <Header />
        {/*   If 'isMobile' is true, render the <BurgerMenu /> component.
        If 'isMobile' is false, render nothing. */}
        {isMobile && <BurgerMenu toggleMenu={toggleMenu} />}
        <div className="main-content">
          {/*  If 'isMobile' is false, render the div className="categories-container desktop"*/}
          {!isMobile && (
            <div className="categories-container desktop">
              {/*  Render the CategoriesList component and tell it that we're NOT in mobile mode */}
              <CategoriesList isMobile={false} />
            </div>
          )}

          <div className="posts-container">
            {/* Always renders posts.
      On mobile, when the burger menu is open, also renders the overlay with categories (mobile menu). */}
            {isMobile && menuOpen && (
              // The data-testid is for tests, not for users.
              <div className="categories-container mobile open" data-testid="categories-list-mobile">
                <CategoriesList onCategorySelect={closeMenu} isMobile={true} />
              </div>
            )}

            <Routes>
              <Route path="/" element={<PostsList />} />
              <Route path="/posts/:postId" element={<PostDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
