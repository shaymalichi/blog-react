import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = ({ isUsername }) => {
    const [activities, setActivities] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        axios.get('/admin/activities')
            .then(response => setActivities(response.data))
            .catch(error => console.error('Error fetching activities:', error));
    }, []);

    const filteredActivities = activities.filter(activity => activity.username.startsWith(filter));

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
            <h3>Manage Products</h3>
            {/* Add form and logic to manage products here */}
        </div>
    );
};

export default Admin;
