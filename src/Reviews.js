import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reviews = ({ isUsername }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ item_id: '', rating: '', comment: '' });

    useEffect(() => {
        axios.get('/reviews')
            .then(response => setReviews(response.data))
            .catch(error => console.error('Error fetching reviews:', error));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('/reviews/add', newReview)
            .then(response => {
                setReviews([...reviews, { ...newReview, id: response.data.insertId }]);
                setNewReview({ item_id: '', rating: '', comment: '' });
            })
            .catch(error => console.error('Error adding review:', error));
    };

    return (
        <div>
            <h2>My Reviews</h2>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id} className="review-item">
                        <h3>{review.name}</h3>
                        <p>Rating: {review.rating}</p>
                        <p>Comment: {review.comment}</p>
                        <p>Date: {new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                ))
            ) : (
                <p>No reviews found.</p>
            )}
            <h3>Add a New Review</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Item ID:
                    <input
                        type="number"
                        value={newReview.item_id}
                        onChange={(e) => setNewReview({ ...newReview, item_id: e.target.value })}
                        required
                    />
                </label>
                <label>
                    Rating:
                    <input
                        type="number"
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                        required
                        min="1"
                        max="5"
                    />
                </label>
                <label>
                    Comment:
                    <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    />
                </label>
                <button type="submit">Submit Review</button>
            </form>
        </div>
    );
};

export default Reviews;
