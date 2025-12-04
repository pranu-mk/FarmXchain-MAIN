import React, { useState } from 'react';
import "../../styles/components/rating.css";

function RatingModal({ product, onClose, onSubmitRating }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitRating(product.id, rating, comment);
      onClose();
    } catch (error) {
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        className={`star ${star <= (hoverRating || rating) ? 'on' : 'off'}`}
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
        disabled={isSubmitting}
        type="button"
      >
        ⭐
      </button>
    ));
  };

  return (
    <div className="modal-overlay">
      <div className="rating-modal">
        <button className="close-modal" onClick={onClose}>×</button>
        
        <h3>Rate {product.name}</h3>
        <p className="product-info">Crop: {product.cropType}</p>
        
        <div className="star-rating">
          {renderStars()}
          <div className="rating-text">
            {rating > 0 && <span>{rating} star{rating > 1 ? 's' : ''}</span>}
          </div>
        </div>

        <div className="rating-comment">
          <textarea
            placeholder="Share your experience with this product (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
            rows="3"
          />
        </div>

        <div className="rating-actions">
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="btn btn-primary"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RatingModal;