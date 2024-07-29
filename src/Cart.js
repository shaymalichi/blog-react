import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = ({ isUsername }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        axios.get('/cart')
            .then(response => setCartItems(response.data))
            .catch(error => console.error('Error fetching cart items:', error));
    }, []);

    const handleRemoveItem = (itemId) => {
        axios.delete(`/cart/${itemId}`)
            .then(() => {
                setCartItems(cartItems.filter(item => item.item_id !== itemId));
            })
            .catch(error => console.error('Error removing item from cart:', error));
    };

    const handleCheckout = () => {
        // Add your checkout logic here
        alert('Proceeding to checkout...');
    };

    return (
        <div>
            <h2>Cart</h2>
            {cartItems.map(item => (
                <div key={item.id}>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <button onClick={() => handleRemoveItem(item.item_id)}>Remove</button>
                </div>
            ))}
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    );
};

export default Cart;
