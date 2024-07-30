import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h2>Add Item</h2>
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
                <button type="submit">Add Item</button>
            </form>
        </div>
    );
};

export default AddItemComponent;
