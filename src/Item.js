import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ItemWindow from "./ItemWindow";
import { Container, Typography, CircularProgress } from "@mui/material";

const Item = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null); // Start with null to handle loading state
    const [reviews, setReviews] = useState([]); // State to store reviews

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemResponse = await axios.get(`/items/${id}`);
                setItem(itemResponse.data);

                const reviewsResponse = await axios.get(`/reviews/${id}`); // Fetch reviews for the item
                setReviews(reviewsResponse.data);
            } catch (error) {
                console.error("Error occurred while fetching data:", error);
            }
        };

        fetchData().then(r => {});
    }, [id]);

    if (!item) {
        return <CircularProgress />; // Show loading indicator while fetching data
    }

    return (
        <Container>
            <Typography variant="h2" gutterBottom>
                Item Details
            </Typography>
            <ItemWindow items={[item]} isUserName={""} />
            <Typography variant="h2" gutterBottom>
                Reviews
            </Typography>
            {reviews.length > 0 ? (
                reviews.map(review => (
                    <div key={review.id}>
                        <Typography variant="h3">{review.title}</Typography>
                        <Typography variant="body1">{review.body}</Typography>
                        <Typography variant="body2">Rating: {review.rating}</Typography>
                        <Typography variant="body2">By: {review.username}</Typography>
                    </div>
                ))
            ) : (
                <Typography variant="body1">No reviews found.</Typography>
            )}
        </Container>
    );
};

export default Item;
