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

    const handleRemoveItem = (itemId, currentQuantity) => {
        let quantityToRemove = 1;

        if (currentQuantity > 1) {
            quantityToRemove = parseInt(prompt(`Enter quantity to remove (1-${currentQuantity}):`, "1"), 10);
            if (isNaN(quantityToRemove) || quantityToRemove < 1 || quantityToRemove > currentQuantity) {
                alert(`Invalid quantity. Please enter a number between 1 and ${currentQuantity}.`);
                return;
            }
        }

        axios.delete(`/cart/${itemId}`, { data: { quantity: quantityToRemove } })
            .then(() => {
                setCartItems(cartItems => cartItems.map(item => {
                    if (item.id === itemId) {
                        return { ...item, quantity: item.quantity - quantityToRemove };
                    }
                    return item;
                }).filter(item => item.quantity > 0));
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
            <ItemWindow
                items={cartItems}
                isUserName={isUsername}
                onDeleteItem={(itemId, currentQuantity) => handleRemoveItem(itemId, currentQuantity)}
                isCartView={true}
            />
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    );
};

export default Cart;
