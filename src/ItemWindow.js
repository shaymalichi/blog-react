import React from 'react';
import './style/ItemWindow.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ItemWindow = ({ items, isUserName, onDeleteItem, context, reviews }) => { // Add reviews prop
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
                <div className="item-window" key={item.id}>
                    <div className="item-header">
                        <a
                            href={`/items/${item.id}`}
                            className="title"
                            onClick={(event) => {
                                event.preventDefault();
                                handleViewItem(item.id);
                            }}
                        >
                            {item.name}
                        </a>
                        {context === 'admin' && (
                            <div>
                                <button className="item-button" onClick={() => handleEditItem(item.id)}>Edit</button>
                                <button className="item-button" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                            </div>
                        )}
                        {context === 'cart' && (
                            <button className="item-button" onClick={() => handleDeleteItem(item.id, item.quantity)}>Remove</button>
                        )}
                        {context !== 'cart' && context !== 'admin' && (
                            <>
                                <button className="item-button" onClick={() => handleAddToCart(item.id)}>Add to Cart</button>
                                {isUserName && (
                                    <button className="item-button" onClick={() => handleAddToWishlist(item.id)}>Add to Wishlist</button>
                                )}
                            </>
                        )}
                    </div>
                    <p className="content">{item.description}</p>
                    <div className="footer">
                        <span className="price">Price: ${item.price}</span>
                        <span className="stock">Stock: {context === 'cart' ? item.quantity : item.stock}</span>
                        <span className="Id">Item ID: {item.id}</span>
                        {item.image_url && <img src={item.image_url} alt={item.name} className="item-image"/>}
                        <span className="published-date">{item.created_at}</span>
                    </div>
                    {reviews && (
                        <div className="reviews-section">
                            <h3>Reviews</h3>
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <div key={review.id}>
                                        <h4>{review.title}</h4>
                                        <p>{review.body}</p>
                                        <p>Rating: {review.rating}</p>
                                        <p>By: {review.username}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews found.</p>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ItemWindow;
