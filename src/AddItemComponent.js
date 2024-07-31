import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const AddItemComponent = ({ isUsername }) => {
    const navigate = useNavigate();
    const [item, setItem] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        image_url: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem({ ...item, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/add-item', item)
            .then(() => {
                alert('Item added successfully!');
                navigate('/admin');
            })
            .catch(error => console.error('Error adding item:', error));
    };

    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Add Item
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        name="name"
                        value={item.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={item.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                    />
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={item.price}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Stock"
                        name="stock"
                        type="number"
                        value={item.stock}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Image URL"
                        name="image_url"
                        value={item.image_url}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <Box mt={3}>
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Add Item
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default AddItemComponent;
