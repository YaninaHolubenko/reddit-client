import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../components/Header';
import PostsList from '../components/PostsList';
import PostDetail from '../components/PostDetail';
import CategoriesList from '../components/CategoriesList';
import '../index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="main-content">
          <div className="categories-container">
            <CategoriesList />
          </div>
          <div className="posts-container">
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