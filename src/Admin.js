import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemWindow from './ItemWindow';

const Admin = ({ isUsername }) => {
    const [items, setItems] = useState([]);
    const [activities, setActivities] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        fetchItems();
        fetchActivities();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('/items');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const fetchActivities = async () => {
        try {
            const response = await axios.get('/admin/activities');
            setActivities(response.data);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    const handleDeleteItem = (itemId) => {
        axios.delete(`/items/${itemId}`)
            .then(() => {
                setItems(prevItems => prevItems.filter(item => item.id !== itemId));
            })
            .catch(error => {
                console.error('Error deleting item:', error);
            });
    };

    const filteredActivities = activities.filter(activity => activity.username && activity.username.startsWith(filter));

    return (
        <div>
            <h2>Admin Panel</h2>
            <input
                type="text"
                placeholder="Filter by username"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
            <table>
                <thead>
                <tr>
                    <th>Date/Time</th>
                    <th>Username</th>
                    <th>Activity Type</th>
                </tr>
                </thead>
                <tbody>
                {filteredActivities.map(activity => (
                    <tr key={activity.id}>
                        <td>{activity.datetime}</td>
                        <td>{activity.username}</td>
                        <td>{activity.type}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <h3>Manage Items</h3>
            <ItemWindow items={items} isUserName={isUsername} onDeleteItem={handleDeleteItem} />
        </div>
    );
};

export default Admin;
