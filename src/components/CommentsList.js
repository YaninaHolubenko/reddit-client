/* CommentsList.js */
import React, { useEffect, useState } from 'react';
// Import React Redux hooks:
// - useDispatch: returns a function that lets you send actions to the Redux store (to update global state)
// - useSelector: lets you select and read specific data from the Redux store
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommentsByPostId, selectCommentsByPostId } from '../features/commentsSlice';
// Import the 'marked' library, which is used to convert Markdown text into HTML.
// Reddit comments often come as Markdown, so we use 'marked' to render them as HTML in our app.
import { marked } from 'marked';
// Import DOMPurify, a library that sanitizes HTML to prevent XSS attacks.
import DOMPurify from 'dompurify';
import './CommentsList.css';

const CommentsList = ({ postId }) => {
  const dispatch = useDispatch();
  // Get the list of comments for the current postId from the Redux store using a selector.
  // Also, use local state to track whether comments should be shown or hidden (initially hidden).
  const comments = useSelector((state) => selectCommentsByPostId(state, postId));
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (postId) {
      dispatch(fetchCommentsByPostId(postId));
    }
  }, [dispatch, postId]);

  const createMarkup = (content) => {
    const sanitizedContent = DOMPurify.sanitize(marked(content || ''));
    return { __html: sanitizedContent };
  };

  const convertGiphyEmbedToUrl = (input) => {
    if (typeof input === 'string' && input.startsWith('giphy|')) {
      const id = input.split('|')[1];
      return `https://media.giphy.com/media/${id}/giphy.gif`;
    }
    return input;
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const renderCommentContent = (comment) => {
    const content = comment.body || '';
    const elements = [];
    const lines = content.split('\n');
    // For each line in the comment text, check if it contains a media link (image, video, or giphy).
    // Use a regular expression to match URLs ending with image/video file extensions or giphy embeds.
    lines.forEach((line, index) => {
      const mediaRegex = /(https?:\/\/[^\s]+\.(jpeg|jpg|gif|png|gifv|mp4|webm)|giphy\|[^\s]+)/i;
      const match = line.match(mediaRegex);
      // If a media link is found in the line, extract the URL and convert giphy embeds to direct URLs if needed.
      if (match) {
        let url = convertGiphyEmbedToUrl(match[0]);

        if (typeof url === 'string') {
          if (url.endsWith('.gifv')) {
            url = url.replace('.gifv', '.mp4');
          }

          elements.push(
            // Wraps the rendered media element in a React.Fragment with a unique key for each line.
            // This is needed so React can efficiently update and render each media element in the comment list.
            <React.Fragment key={index}>
              {url.endsWith('.mp4') || url.endsWith('.webm') ? (
                <video src={url} controls className="comment-media" />
              ) : (
                <img
                  src={url}
                  alt="Comment media"
                  className="comment-media"
                  onError={(e) => (e.target.style.display = 'none')}
                />

              )}
            </React.Fragment>
          );
        }
      } else {
        // For lines that do not contain media, render them as a <p> element.
        // Use 'dangerouslySetInnerHTML' to display the line as HTML (with Markdown already converted).
        elements.push(<p key={index} dangerouslySetInnerHTML={createMarkup(line)} />);
      }
    });

    return elements;
  };

  const renderCommentDate = (timestamp) => {
    // Convert the Unix timestamp (in seconds) to a JavaScript Date object.
    // Reddit returns comment times as seconds since the Unix epoch, but JS needs milliseconds, so we multiply by 1000.
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="comments-section">
      <button className="toggle-comments" onClick={handleToggleComments}>
        {showComments ? 'Hide Comments' : 'Show Comments'}
      </button>
      {showComments && comments.map((comment) => (
        <div key={comment.id} className="comment">
          <p><strong>{comment.author}</strong> - {renderCommentDate(comment.created_utc)}</p>
          {renderCommentContent(comment)}
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
