import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PastOrders = ({ isUsername }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('/past-orders')
            .then(response => setOrders(response.data))
            .catch(error => console.error('Error fetching past orders:', error));
    }, []);

    return (
        <div>
            <h2>Past Orders</h2>
            {orders.length > 0 ? (
                orders.map((order, index) => (
                    <div key={index} className="order">
                        <h3>Order ID: {order.id}</h3>
                        <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                        <p>Total Amount: ${order.total_amount.toFixed(2)}</p>
                        <h4>Items:</h4>
                        <ul>
                            {order.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                    {item.name} - ${item.price.toFixed(2)} x {item.quantity}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p>No past orders found.</p>
            )}
        </div>
    );
};

export default PastOrders;
