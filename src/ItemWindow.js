import React from 'react';
import './style/ItemWindow.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, CardContent, Typography, CardActions } from '@mui/material';

const ItemWindow = ({ items, isUserName, onDeleteItem, context, reviews }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleAddToCart = (itemId) => {
        axios.post('/cart/add', { item_id: itemId })
            .then(() => {
                alert('Item added to cart');
            })
            .catch(error => {
                console.error('Error adding item to cart:', error);
            });
    };

    const handleAddToWishlist = (itemId) => {
        axios.post('/wishlist/add', { item_id: itemId })
            .then(() => {
                alert('Item added to wishlist');
            })
            .catch(error => {
                console.error('Error adding item to wishlist:', error);
            });
    };

    const handleDeleteItem = (itemId, currentQuantity) => {
        if (context === 'cart') {
            const quantityToRemove = parseInt(prompt(`Enter quantity to remove (1-${currentQuantity}):`), 10);
            if (quantityToRemove > 0 && quantityToRemove <= currentQuantity) {
                axios.delete(`/cart/${itemId}`, { data: { quantity: quantityToRemove } })
                    .then(() => {
                        onDeleteItem(itemId, quantityToRemove);
                    })
                    .catch(error => {
                        console.error('Error removing item from cart:', error);
                    });
            } else {
                alert('Invalid quantity');
            }
        } else {
            const isConfirmed = window.confirm('Are you sure you want to delete this item?');
            if (isConfirmed) {
                axios.delete(`/items/${itemId}`)
                    .then(() => {
                        onDeleteItem(itemId);
                    })
                    .catch(error => {
                        console.error('Error deleting item:', error);
                    });
            }
        }
    };

    const handleEditItem = (itemId) => {
        navigate(`/edit/${itemId}`);
    };

    const handleViewItem = (itemId) => {
        navigate(`/items/${itemId}`);
    };

    return (
        <div className="item-container">
            {items.map((item) => (
                <Card className="item-window" key={item.id}>
                    <CardContent>
                        <Typography variant="h5" component="a" href={`/items/${item.id}`} onClick={(event) => { event.preventDefault(); handleViewItem(item.id); }}>
                            {item.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {item.description}
                        </Typography>
                        <Typography variant="body1" color="textPrimary">
                            Price: ${item.price}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Stock: {context === 'cart' ? item.quantity : item.stock}
                        </Typography>
                        {item.image_url && <img src={item.image_url} alt={item.name} className="item-image" />}
                        <Typography variant="body2" color="textSecondary">
                            {item.created_at}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        {context === 'admin' && (
                            <>
                                <Button size="small" color="primary" onClick={() => handleEditItem(item.id)}>Edit</Button>
                                <Button size="small" color="secondary" onClick={() => handleDeleteItem(item.id)}>Delete</Button>
                            </>
                        )}
                        {context === 'cart' && (
                            <Button size="small" color="secondary" onClick={() => handleDeleteItem(item.id, item.quantity)}>Remove</Button>
                        )}
                        {context !== 'cart' && context !== 'admin' && (
                            <>
                                <Button size="small" color="primary" onClick={() => handleAddToCart(item.id)}>Add to Cart</Button>
                                {isUserName && isUserName !== 'admin' && (
                                    <Button size="small" color="primary" onClick={() => handleAddToWishlist(item.id)}>Add to Wishlist</Button>
                                )}
                            </>
                        )}
                    </CardActions>
                    {reviews && (
                        <CardContent>
                            <Typography variant="h6">Reviews</Typography>
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <div key={review.id}>
                                        <Typography variant="subtitle1">{review.title}</Typography>
                                        <Typography variant="body2">{review.body}</Typography>
                                        <Typography variant="body2">Rating: {review.rating}</Typography>
                                        <Typography variant="body2">By: {review.username}</Typography>
                                    </div>
                                ))
                            ) : (
                                <Typography variant="body2">No reviews found.</Typography>
                            )}
                        </CardContent>
                    )}
                </Card>
            ))}
        </div>
    );
};

export default ItemWindow;
