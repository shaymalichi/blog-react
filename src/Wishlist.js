import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Button } from '@mui/material';

const Wishlist = ({ isUsername }) => {
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        axios.get('/wishlist')
            .then(response => setWishlistItems(response.data))
            .catch(error => console.error('Error fetching wishlist:', error));
    }, []);

    const handleRemoveItem = (id) => {
        axios.delete(`/wishlist/${id}`)
            .then(() => {
                setWishlistItems(wishlistItems.filter(item => item.id !== id));
            })
            .catch(error => console.error('Error removing item from wishlist:', error));
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Wishlist</Typography>
            {wishlistItems.length > 0 ? (
                wishlistItems.map((item) => (
                    <Paper key={item.id} style={{ padding: '16px', marginBottom: '16px' }}>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography>Price: ${item.price}</Typography>
                        {item.image_url && <img src={item.image_url} alt={item.name} style={{ maxWidth: '100%' }} />}
                        <Button variant="contained" color="secondary" onClick={() => handleRemoveItem(item.id)}>Remove from Wishlist</Button>
                    </Paper>
                ))
            ) : (
                <Typography>No items in wishlist.</Typography>
            )}
        </Container>
    );
};

export default Wishlist;
