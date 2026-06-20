import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import './Reviews.css';

const StarRating = ({ value, onChange, readonly = false }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-row">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          className={`star-btn ${(hovered || value) >= s ? 'lit' : ''}`}
          onClick={() => !readonly && onChange && onChange(s)}
          onMouseEnter={() => !readonly && setHovered(s)}
          onMouseLeave={() => !readonly && setHovered(0)}
          disabled={readonly}
          aria-label={`${s} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const Reviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (user && reviews.length) {
      const already = reviews.some((r) => r.user?._id === user._id || r.user?.id === user._id);
      setHasReviewed(already);
    }
  }, [user, reviews]);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data.data || []);
    } catch {
      // silently fail — reviews are non-critical
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!rating) { setError('Please select a star rating'); return; }
    if (!comment.trim()) { setError('Please write a comment'); return; }

    setSubmitting(true);
    try {
      const res = await api.post('/reviews', { rating, comment });
      setReviews((prev) => [res.data.data, ...prev]);
      setRating(0);
      setComment('');
      setHasReviewed(true);
      setSuccess('Thank you for your review!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <section className="reviews-section">
      <div className="reviews-header reveal">
        <p className="section-label">Guest Reviews</p>
        <h2 className="section-heading">What Our Guests Say</h2>
        <div className="ornament-line" />
      </div>

      {/* Review cards */}
      {reviews.length > 0 && (
        <div className="reviews-grid stagger-parent">
          {reviews.map((r) => (
            <div className="review-card stagger-child" key={r._id}>
              <StarRating value={r.rating} readonly />
              <p className="review-comment">"{r.comment}"</p>
              <div className="review-meta">
                <span className="review-author">{r.user?.name || 'Guest'}</span>
                <span className="review-date">{formatDate(r.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Write a review */}
      <div className="review-form-wrap reveal">
        {!user ? (
          <p className="review-gate">
            <Link to="/login">Log in</Link> to share your experience
          </p>
        ) : hasReviewed ? (
          <p className="review-gate thanks">✓ You've already shared your review — thank you!</p>
        ) : (
          <>
            <h3 className="review-form-title">Share Your Experience</h3>
            <form className="review-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>Your Rating</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div className="form-row">
                <label htmlFor="review-comment">Your Comment</label>
                <textarea
                  id="review-comment"
                  rows={4}
                  maxLength={500}
                  placeholder="Tell us about your experience…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <span className="char-count">{comment.length}/500</span>
              </div>
              {error   && <p className="form-error">{error}</p>}
              {success && <p className="form-success">{success}</p>}
              <button type="submit" className="btn-gold" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
};

export default Reviews;
