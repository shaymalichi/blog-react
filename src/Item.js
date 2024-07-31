import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ItemWindow from "./ItemWindow";

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
        return <div>Loading...</div>; // Show loading message while fetching data
    }

    return (
        <div>
            <h2>Item Details</h2>
            <ItemWindow items={[item]} isUserName={""} />
            <h2>Reviews</h2>
            {reviews.length > 0 ? (
                reviews.map(review => (
                    <div key={review.id}>
                        <h3>{review.title}</h3>
                        <p>{review.body}</p>
                        <p>Rating: {review.rating}</p>
                        <p>By: {review.username}</p>
                    </div>
                ))
            ) : (
                <p>No reviews found.</p>
            )}
        </div>
    );
};

export default Item;
