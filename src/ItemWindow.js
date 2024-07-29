import './style/ItemWindow.css';
import axios from 'axios';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ItemWindow = ({ items, isUserName, onDeleteItem }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleDeleteItem = (itemId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');

        if (isConfirmed) {
            axios
                .delete(`/items/${itemId}`, { data: { id: itemId, user: isUserName } })
                .then(() => {
                    const updatedItems = items.filter((item) => item.id !== itemId);
                    onDeleteItem(updatedItems); // Call the callback function
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const handleEditItem = (itemId) => {
        navigate(`/edit/${itemId}`);
    };

    const handleViewItem = (itemId) => {
        navigate(`/items/${itemId}`);
    };

    return (
        <div>
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
                        {item.user_id === isUserName && (
                            <div>
                                <button className="item-button" onClick={() => handleEditItem(item.id)}>Edit</button>
                                <button className="item-button" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                            </div>
                        )}
                    </div>
                    <p className="content">{item.description}</p>
                    <div className="footer">
                        <span className="price">Price: ${item.price}</span>
                        <span className="stock">Stock: {item.stock}</span>
                        {item.image_url && <img src={item.image_url} alt={item.name} className="item-image" />}
                        <span className="published-date">{item.created_at}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItemWindow;
