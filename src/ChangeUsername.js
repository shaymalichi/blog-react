import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Grid, Container } from '@mui/material';

const ChangeUsername = () => {
    const [newUsername, setNewUsername] = useState('');
    const [message, setMessage] = useState('');

    const handleChangeUsername = (event) => {
        event.preventDefault();
        axios.post('/change-username', { newUsername })
            .then(response => {
                alert("Username changed to " + newUsername + "\nLogin again for username to update");
                setMessage(response.data.message);
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            })
            .catch(error => {
                setMessage(error.response.data.message);
            });
    };

    return (
        <Container>
            <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center">
                <Grid item>
                    <Typography variant="h4">Change Username</Typography>
                </Grid>
                <Grid item>
                    <form onSubmit={handleChangeUsername}>
                        <TextField
                            label="New Username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="contained" color="primary">Change Username</Button>
                    </form>
                </Grid>
                {message && (
                    <Grid item>
                        <Typography variant="body1" color="error">{message}</Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default ChangeUsername;
