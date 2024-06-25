import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate, useParams } from 'react-router-dom';

const CommentStatus = () => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { postId } = useParams(); // Assuming you're getting the postId from the URL parameters

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: comment }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add comment');
      }

      const data = await response.json();
      setSuccess('Comment added successfully!');
      setComment('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="comment-status">
      <div className="container">
        <h2>What's on Your Mind?</h2>
        <h2>Comment on Post</h2>

        <form onSubmit={handleCommentSubmit} className="form comment-status_form">
          <textarea
            placeholder="Add your comment here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="5"
            required
          />
          <button type="submit" className='btn primary'>Comment</button>
        </form>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </div>
    </section>
  );
};

export default CommentStatus;
