import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Grid, Container } from '@mui/material';

const EditItemComponent = ({ isUsername }) => {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        image_url: ''
    });

    useEffect(() => {
        axios.get(`/items/${itemId}`)
            .then(response => setItem(response.data))
            .catch(error => console.error('Error fetching item details:', error));
    }, [itemId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem({ ...item, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`/items/${itemId}`, item)
            .then(() => {
                alert('Item updated successfully!');
                navigate('/admin'); // Navigate back to the admin page after successful update
            })
            .catch(error => console.error('Error updating item:', error));
    };

    return (
        <Container>
            <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center">
                <Grid item>
                    <Typography variant="h4">Edit Item</Typography>
                </Grid>
                <Grid item>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Name"
                            name="name"
                            value={item.name}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={item.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            required
                        />
                        <TextField
                            label="Price"
                            name="price"
                            type="number"
                            value={item.price}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Stock"
                            name="stock"
                            type="number"
                            value={item.stock}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Image URL"
                            name="image_url"
                            value={item.image_url}
                            onChange={handleChange}
                            required
                        />
                        <Button type="submit" variant="contained" color="primary">Update Item</Button>
                    </form>
                </Grid>
            </Grid>
        </Container>
    );
};

export default EditItemComponent;
