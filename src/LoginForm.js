import React, { useState } from 'react';
import { Button, TextField, Grid, ThemeProvider } from "@mui/material";
import theme from './theme';
import { blue } from "@mui/material/colors";
import axios from 'axios';

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // Send an API request to the backend to check if the user and password exist
        axios.post('/login', { username, password })
            .then(response => {
                // Handle the response from the backend
                const data = response.data;
                if (data.success) {
                    // Login successful
                    console.log("Login successful");
                } else {
                    // Login failed
                    console.log("Login failed");
                }
            })
            .catch(error => {
                console.error("Error occurred during login:", error);
            });
    };

    return (
        <ThemeProvider theme={theme()}>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '100vh' }}
            >
                <form>
                    <h2>Login</h2>
                    <div>
                        <TextField id="outlined-basic" label="Username" variant="outlined" value={username} onChange={(event) => setUsername(event.target.value)} />
                    </div>
                    <div>
                        <TextField id="outlined-basic" label="Password" variant="outlined" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    </div>
                    <div>
                        <ThemeProvider theme={theme(blue)}>
                            <Button type="button" variant="contained" onClick={handleLogin}>Login</Button>
                        </ThemeProvider>
                    </div>
                </form>
            </Grid>
        </ThemeProvider>
    );
}

export default LoginForm;