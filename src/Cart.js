import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemWindow from './ItemWindow';

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
                setCartItems(cartItems.filter(item => item.id !== itemId));
            })
            .catch(error => console.error('Error removing item from cart:', error));
    };

    const handleCheckout = () => {
        alert('Proceeding to checkout...');
        // Add your checkout logic here
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div>
            <h2>Cart</h2>
            <ItemWindow
                items={cartItems}
                isUserName={isUsername}
                onDeleteItem={handleRemoveItem}
                context="cart"
            />
            <h3>Total: ${calculateTotal()}</h3>
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    );
};

export default Cart;
