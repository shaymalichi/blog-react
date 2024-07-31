import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Grid } from '@mui/material';

const PastOrders = ({ isUsername }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('/past-orders')
            .then(response => {
                console.log(response.data); // Debugging log
                setOrders(response.data);
            })
            .catch(error => console.error('Error fetching past orders:', error));
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Past Orders</Typography>
            {orders.length > 0 ? (
                orders.map((order, index) => (
                    <Paper key={index} style={{ padding: '16px', marginBottom: '16px' }}>
                        <Typography variant="h6">Order ID: {order.id}</Typography>
                        <Typography>Date: {new Date(order.created_at).toLocaleDateString()}</Typography>
                        <Typography>Total Amount: ${order.total_amount.toFixed(2)}</Typography>
                        <Typography variant="subtitle1">Items:</Typography>
                        <ul>
                            {order.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                    {item.name} - ${item.price.toFixed(2)} x {item.quantity}
                                </li>
                            ))}
                        </ul>
                    </Paper>
                ))
            ) : (
                <Typography>No past orders found.</Typography>
            )}
        </Container>
    );
};

export default PastOrders;
