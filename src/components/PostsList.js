// PostsList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../features/postsThunks';
import {
  selectFilteredPosts,
  selectPostsStatus,
  selectPostsError
} from '../features/postsSelectors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faStar } from '@fortawesome/free-solid-svg-icons';
import './PostsList.css';
import { useNavigate } from 'react-router-dom';
import { Twemoji } from 'react-emoji-render';

const PostsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posts = useSelector(selectFilteredPosts);
  const postStatus = useSelector(selectPostsStatus);
  const error = useSelector(selectPostsError);
  const selectedCategory = useSelector((state) => state.selectedCategory);

  useEffect(() => {
    dispatch(fetchPosts(selectedCategory));
  }, [dispatch, selectedCategory]);

  const formatCategoryName = (name) => {
    if (name.startsWith('/r/')) {
      name = name.substring(3);
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const renderMediaThumbnail = (post) => {
    if (post.preview && post.preview.images && post.preview.images.length > 0) {
      let imageUrl = post.preview.images[0].source.url.replace(/&amp;/g, '&');

      // Giphy fix
      if (imageUrl.includes('giphy') && !imageUrl.startsWith('https://')) {
        imageUrl = `https://i.${imageUrl}`;
      }

      return (
        <img src={imageUrl} alt={post.title} className="post-thumbnail" />
      );
    } else if (
      post.thumbnail &&
      post.thumbnail !== 'self' &&
      post.thumbnail !== 'default' &&
      post.thumbnail !== 'nsfw'
    ) {
      let thumbnailUrl = post.thumbnail.replace(/&amp;/g, '&');

      // Giphy fix
      if (thumbnailUrl.includes('giphy') && !thumbnailUrl.startsWith('https://')) {
        thumbnailUrl = `https://i.${thumbnailUrl}`;
      }

      return (
        <img src={thumbnailUrl} alt={post.title} className="post-thumbnail" />
      );
    } else if (post.thumbnail === 'spoiler') {
      return <div className="post-thumbnail-spoiler">Spoiler</div>;
    }

    return null;
  };

  let content;

  if (postStatus === 'loading') {
    content = <p>Loading...</p>;
  } else if (postStatus === 'succeeded') {
    content = posts.map((post) => (
      <article
        key={post.id}
        className="post"
        onClick={() => handlePostClick(post.id)}
        title="Click to see details"
      >
        <h3>
          <Twemoji text={decodeHtml(post.title)} />
        </h3>
        {renderMediaThumbnail(post)}
        <p>{post.author}</p>
        <p className="post-stats">
          <span className="comments">
            <FontAwesomeIcon icon={faComment} className="fa-comment" />{' '}
            {post.num_comments} comments
          </span>
          <span className="score">
            <FontAwesomeIcon icon={faStar} className="fa-star" /> {post.score}
          </span>
        </p>
      </article>
    ));
  } else if (postStatus === 'failed') {
    content = <p>{error}</p>;
  }

  return (
    <section className="posts-list">
      <h2>{selectedCategory ? formatCategoryName(selectedCategory) : 'Posts'}</h2>
      {content}
    </section>
  );
};

export default PostsList;

