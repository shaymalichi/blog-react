import React from 'react';
import { Button, TextField, Grid, ThemeProvider } from "@mui/material";
import theme from './style/theme';
import axios from "axios";

function SignupForm() {
    const handleSignup = (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        const createdTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const data = {
            username: username,
            password: password,
            created_at: createdTime
        };

        axios.post('/signup', data)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });

        console.log("Signup:", username, password, createdTime);
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
                <form onSubmit={handleSignup}>
                    <h2>Sign Up</h2>
                    <div>
                        <TextField id="outlined-basic" name="username" label="Username" variant="outlined" />
                    </div>
                    <div>
                        <TextField id="outlined-basic" name="password" label="Password" variant="outlined" type="password" />
                    </div>
                    <div>
                        <Button type="submit" variant="contained">Sign Up</Button>
                    </div>
                </form>
            </Grid>
        </ThemeProvider>
    );
}

export default SignupForm;
