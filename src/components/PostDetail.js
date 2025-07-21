// src/components/PostDetail.js

import React, { useEffect } from 'react';
// Import React Redux hooks:
// - useDispatch: returns a function that lets you send actions to the Redux store (to update global state)
// - useSelector: lets you select and read specific data from the Redux store
import { useDispatch, useSelector } from 'react-redux';
// useParams lets us get URL parameters (like postId) from the browser's address bar.
// Example: for "/posts/123", postId will be "123
import { useParams } from 'react-router-dom';
import { fetchPostById, selectPostById, clearPostDetail } from '../features/postDetailSlice';
// Import html-react-parser to safely convert raw HTML strings into React elements for rendering.
// Example: "<p>Hello <b>world</b></p>" becomes real React nodes in the UI.
import parse from 'html-react-parser';
// Import DOMPurify to sanitize any HTML content before rendering it.
// This prevents XSS attacks and makes user-generated HTML safe to display.
import DOMPurify from 'dompurify';
import './PostDetail.css';
// Import the FontAwesomeIcon component from the 'react-fontawesome' package.
// This lets us use vector icons from the Font Awesome library as React components.(https://fontawesome.com/)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faStar } from '@fortawesome/free-solid-svg-icons';
// Import Twemoji component to render emoji in post titles as Twitter-style SVG icons.
import { Twemoji } from 'react-emoji-render';
import CommentsList from './CommentsList';

const PostDetail = () => {
  // useParams() returns all URL parameters based on the route pattern you defined.
  // For example, if you have <Route path="/posts/:postId" ... />
  // and the URL is /posts/123, then useParams() returns { postId: "123" }.
  const { postId } = useParams();
  const dispatch = useDispatch();
  const postDetail = useSelector((state) => selectPostById(state, postId));
  const postStatus = useSelector((state) => state.postDetail.status);
  // Every time the postId changes (for example, when the user clicks on a different post),
  // first clear any previously loaded post details from the state to avoid showing outdated content.
  // Then, fetch the new post details for the current postId.
  // It's important to clear BEFORE fetching, otherwise the old post may flash or overlap with the new one.
  useEffect(() => {
    if (postId) {
      dispatch(clearPostDetail());
      dispatch(fetchPostById(postId));
    }
    // - 'dispatch': It's recommended to include dispatch as a dependency for consistency and to avoid React warnings,
    //   even though the dispatch function itself usually doesn't change.
  }, [dispatch, postId]);

  if (postStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (!postDetail) {
    return <div>No post found.</div>;
  }
  // Decodes HTML entities (like &amp; or &lt;) to plain text for display
  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const cleanHtmlContent = (htmlContent) => {
    const decodedHtml = decodeHtml(htmlContent);
    const sanitizedHtml = DOMPurify.sanitize(decodedHtml, {
      USE_PROFILES: { html: true },
    });
    return parse(sanitizedHtml);
  };

  const renderMediaContent = () => {
    if (postDetail.media && postDetail.media.reddit_video) {
      const videoUrl = postDetail.media.reddit_video.fallback_url;
      return (
        <div className="media-container">
          <video controls className="post-media">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (postDetail.preview && postDetail.preview.reddit_video_preview) {
      const videoUrl = postDetail.preview.reddit_video_preview.fallback_url;
      return (
        <div className="media-container">
          <video controls className="post-media">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (postDetail.preview && postDetail.preview.images && postDetail.preview.images.length > 0) {
      const imageUrl = postDetail.preview.images[0].source.url.replace(/&amp;/g, '&');
      return (
        <img
          src={imageUrl}
          alt={postDetail.title}
          className="post-image post-detail-content post-media"
        />
      );
    }

    if (
      postDetail.thumbnail &&
      postDetail.thumbnail !== 'self' &&
      postDetail.thumbnail !== 'default' &&
      postDetail.thumbnail !== 'nsfw' &&
      postDetail.thumbnail !== 'spoiler'
    ) {
      const thumbnailUrl = postDetail.thumbnail.replace(/&amp;/g, '&');
      return (
        <img
          src={thumbnailUrl}
          alt="Fallback preview"
          className="post-image post-detail-content post-media"
        />
      );
    }

    return null;
  };

  const renderEmbeddedContent = () => {
    const html = postDetail.secure_media_embed?.content || postDetail.media_embed?.content;
    if (!html) return null;

    const sanitizedHtml = DOMPurify.sanitize(html, {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
    });

    return <div className="post-detail-content post-media">{parse(sanitizedHtml)}</div>;
  };

  const renderContentMessage = () => {
    if (!postDetail.selftext_html) {
      if (postDetail.subreddit === 'LivestreamFail') {
        return <p>Content not available due to access restrictions.</p>;
      }
      return <p>No content available</p>;
    }
    return null;
  };

  return (
    <div className="post-detail">
      <h2 className="post-title">
        {/*Render the title; Twemoji makes emojis look the same everywhere. */}
        <Twemoji text={decodeHtml(postDetail.title)} />
      </h2>
      <p>
        Posted by {postDetail.author} on{' '}
        {new Date(postDetail.created_utc * 1000).toLocaleString()}
      </p>

      <div className="post-detail-content">
        {postDetail.selftext_html ? cleanHtmlContent(postDetail.selftext_html) : null}
      </div>

      {renderMediaContent() || renderEmbeddedContent() || renderContentMessage()}

      <div className="post-stats">
        <span className="comments">
          <FontAwesomeIcon icon={faComment} className="fa-comment" />{' '}
          {postDetail.num_comments} comments
        </span>
        <span className="score">
          <FontAwesomeIcon icon={faStar} className="fa-star" /> {postDetail.score}
        </span>
      </div>

      <CommentsList postId={postId} />
    </div>
  );
};

export default PostDetail;
