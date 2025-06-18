/* CommentsList.js */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommentsByPostId, selectCommentsByPostId } from '../features/commentsSlice';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './CommentsList.css';

const CommentsList = ({ postId }) => {
  const dispatch = useDispatch();
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

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const renderCommentContent = (comment) => {
    const content = comment.body || '';
    const elements = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const mediaRegex = /(https?:\/\/[^\s]+\.(jpeg|jpg|gif|png|gifv|mp4|webm))/i;
      const match = line.match(mediaRegex);

      if (match) {
        let url = match[0];
        if (typeof url === 'string') {
          if (url.endsWith('.gifv')) {
            url = url.replace('.gifv', '.mp4');
          }
          elements.push(
            <React.Fragment key={index}>
              {url.endsWith('.mp4') || url.endsWith('.webm') ? (
                <video src={url} controls className="comment-media"></video>
              ) : (
                <img src={url} alt="Comment media" className="comment-media" />
              )}
            </React.Fragment>
          );
        }
      } else {
        elements.push(<p key={index} dangerouslySetInnerHTML={createMarkup(line)} />);
      }
    });

    return elements;
  };

  const renderCommentDate = (timestamp) => {
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
