import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Paper, Grid } from '@mui/material';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ product_name: '', rating: '', comment: '' });
    const [errorMessage, setErrorMessage] = useState('');

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
                setNewReview({ product_name: '', rating: '', comment: '' });
                setErrorMessage('');
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    setErrorMessage(error.response.data.message);
                } else {
                    console.error('Error adding review:', error);
                }
            });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>My Reviews</Typography>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <Paper key={review.id} style={{ padding: '16px', marginBottom: '16px' }}>
                        <Typography variant="h6">{review.product_name}</Typography>
                        <Typography>Rating: {review.rating}</Typography>
                        <Typography>Date: {new Date(review.created_at).toLocaleDateString()}</Typography>
                        <Typography>Comment: {review.comment}</Typography>
                    </Paper>
                ))
            ) : (
                <Typography>No reviews found.</Typography>
            )}
            <Typography variant="h5" gutterBottom>Add a New Review</Typography>
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Product Name"
                            value={newReview.product_name}
                            onChange={(e) => setNewReview({ ...newReview, product_name: e.target.value })}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Rating"
                            type="number"
                            value={newReview.rating}
                            onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                            required
                            inputProps={{ min: 1, max: 5 }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Comment"
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">Submit Review</Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default Reviews;
