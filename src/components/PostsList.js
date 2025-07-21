// src/components/PostsList.js
import React, { useEffect } from 'react';
// Import React Redux hooks:
// - useDispatch: returns a function that lets you send actions to the Redux store (to update global state)
// - useSelector: lets you select and read specific data from the Redux store
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchSearchPosts } from '../features/postsThunks';
// Import the FontAwesomeIcon component from the 'react-fontawesome' package.
// This lets us use vector icons from the Font Awesome library as React components.(https://fontawesome.com/)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faStar } from '@fortawesome/free-solid-svg-icons';
import './PostsList.css';
// Import a custom hook that wraps useNavigate from react-router-dom.
// This helps to easily mock navigation in tests.
import useAppNavigate from '../hooks/useAppNavigate';
// Import Twemoji component to render emoji in post titles as Twitter-style SVG icons.
import { Twemoji } from 'react-emoji-render';

const PostsList = () => {
  const dispatch = useDispatch();
  const navigate = useAppNavigate();

  //Get state values from the Redux store
  const posts = useSelector(state => state.allPosts.posts);
  const status = useSelector(state => state.allPosts.status);
  const error = useSelector(state => state.allPosts.error);
  const category = useSelector(state => state.selectedCategory);
  const searchTerm = useSelector(state => state.searchTerm);

  //Effect: If there is a searchTerm, fetch posts by search. Otherwise, fetch posts by selected category.
  useEffect(() => {
    if (searchTerm) {
      dispatch(fetchSearchPosts(searchTerm));
    } else {
      dispatch(fetchPosts(category));
    }
  }, [dispatch, category, searchTerm]);

  // Format the category name for display:
  // - If the name starts with '/r/', remove it.
  // - Capitalise the first letter of the name.
  const formatCategoryName = (name) => {
    if (!name) return '';
    if (name.startsWith('/r/')) name = name.slice(3);
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Decodes HTML entities (like &amp; or &lt;) to plain text for display
  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const handlePostClick = (id) => {
    navigate(`/posts/${id}`);
  };

  const renderThumbnail = (post) => {
    // 1. Handle full preview image for the post (if available)

    // If the post has a preview image, show it as a thumbnail.
    // - Reddit often returns URLs with HTML-encoded ampersands (&amp;), so we replace them with '&' for a valid URL.
    // - Special handling for Giphy images: sometimes the URL is missing 'https://' and needs to be fixed.
    // Use optional chaining to safely check if preview images exist on the post.
    // Prevents runtime errors if 'preview' or 'images' are missing.
    if (post.preview?.images?.length) {
      let url = post.preview.images[0].source.url.replace(/&amp;/g, '&');
      if (url.includes('giphy') && !url.startsWith('https://')) {
        url = `https://i.${url}`;
      }
      return <img src={url} alt={post.title} className="post-thumbnail" />;
    }
    // 2. Handle regular thumbnail image (fallback if no preview image)
    if (post.thumbnail && !['self', 'default', 'nsfw'].includes(post.thumbnail)) {
      let url = post.thumbnail.replace(/&amp;/g, '&');
      if (url.includes('giphy') && !url.startsWith('https://')) {
        url = `https://i.${url}`;
      }
      return <img src={url} alt={post.title} className="post-thumbnail" />;
    }
    // 3. Handle "Spoiler" posts by showing a placeholder instead of an image
    if (post.thumbnail === 'spoiler') {
      return <div className="post-thumbnail-spoiler">Spoiler</div>;
    }
    return null;
  };

  // Section heading 
  let heading;
  if (searchTerm) {
    heading = `Results for "${searchTerm}"`;
  } else if (category) {
    heading = formatCategoryName(category);
  } else {
    heading = 'Posts';
  }

  // Main content
  let content;
  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'succeeded') {
    content = posts.map(post => (
      <article
        key={post.id}
        className="post"
        onClick={() => handlePostClick(post.id)}
        title="Click to see details"
      >
       {/*Render the title; Twemoji makes emojis look the same everywhere. */}
        <h3><Twemoji text={decodeHtml(post.title)} /></h3>
        {renderThumbnail(post)}
        <p>{post.author}</p>
        <p className="post-stats">
          <span className="comments">
            <FontAwesomeIcon icon={faComment} /> {post.num_comments} comments
          </span>
          <span className="score">
            <FontAwesomeIcon icon={faStar} /> {post.score}
          </span>
        </p>
      </article>
    ));
  } else if (status === 'failed') {
    content = <p>{error}</p>;
  }

  return (
    <section className="posts-list">
      <h2>{heading}</h2>
      {content}
    </section>
  );
};

export default PostsList;
