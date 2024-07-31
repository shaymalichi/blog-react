import React, { useState } from 'react';
import axios from 'axios';

const ChangeUsername = () => {
    const [newUsername, setNewUsername] = useState('');
    const [message, setMessage] = useState('');

    const handleChangeUsername = (event) => {
        event.preventDefault();
        axios.post('/change-username', { newUsername })
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(error => {
                setMessage(error.response.data.message);
            });
    };

    return (
        <div>
            <h2>Change Username</h2>
            <form onSubmit={handleChangeUsername}>
                <div>
                    <label>New Username:</label>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Change Username</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ChangeUsername;
