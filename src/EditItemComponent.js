import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditItemComponent = ({ isUsername }) => {
    const { itemId } = useParams();
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
            .then(() => alert('Item updated successfully!'))
            .catch(error => console.error('Error updating item:', error));
    };

    return (
        <div>
            <h2>Edit Item</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={item.name} onChange={handleChange} />
                </label>
                <label>
                    Description:
                    <textarea name="description" value={item.description} onChange={handleChange}></textarea>
                </label>
                <label>
                    Price:
                    <input type="number" name="price" value={item.price} onChange={handleChange} />
                </label>
                <label>
                    Stock:
                    <input type="number" name="stock" value={item.stock} onChange={handleChange} />
                </label>
                <label>
                    Image URL:
                    <input type="text" name="image_url" value={item.image_url} onChange={handleChange} />
                </label>
                <button type="submit">Update Item</button>
            </form>
        </div>
    );
};

export default EditItemComponent;
