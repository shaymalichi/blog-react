import React from 'react';
import './style/ItemWindow.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ItemWindow = ({ items, isUserName, onDeleteItem, isCartView }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleAddToCart = (itemId) => {
        if (!isUserName) {
            navigate('/login');
        } else {
            axios.post('/cart/add', { item_id: itemId })
                .then(() => {
                    alert('Item added to cart');
                })
                .catch(error => {
                    console.error('Error adding item to cart:', error);
                });
        }
    };

    const handleDeleteItem = (itemId, currentQuantity) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');

        if (isConfirmed) {
            onDeleteItem(itemId, currentQuantity);
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
                        {isUserName === 'admin' && (
                            <div>
                                <button className="item-button" onClick={() => handleEditItem(item.id)}>Edit</button>
                                <button className="item-button" onClick={() => handleDeleteItem(item.id, item.quantity)}>Delete</button>
                            </div>
                        )}
                        {!isCartView && (
                            <button className="item-button" onClick={() => handleAddToCart(item.id)}>Add to Cart</button>
                        )}
                        {isCartView && (
                            <button className="item-button" onClick={() => handleDeleteItem(item.id, item.quantity)}>Remove</button>
                        )}
                    </div>
                    <p className="content">{item.description}</p>
                    <div className="footer">
                        <span className="price">Price: ${item.price}</span>
                        {isCartView ? (
                            <span className="stock">Quantity: {item.quantity}</span>
                        ) : (
                            <span className="stock">Stock: {item.stock}</span>
                        )}
                        {item.image_url && <img src={item.image_url} alt={item.name} className="item-image" />}
                        <span className="published-date">{item.created_at}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItemWindow;
