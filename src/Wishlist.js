import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        <div>
            <h2>Wishlist</h2>
            {wishlistItems.length > 0 ? (
                wishlistItems.map((item) => (
                    <div key={item.id} className="wishlist-item">
                        <h3>{item.name}</h3>
                        <p>Price: ${item.price}</p>
                        {item.image_url && <img src={item.image_url} alt={item.name} className="item-image" />}
                        <button onClick={() => handleRemoveItem(item.id)}>Remove from Wishlist</button>
                    </div>
                ))
            ) : (
                <p>No items in wishlist.</p>
            )}
        </div>
    );
};

export default Wishlist;
