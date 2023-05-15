import React from 'react';
import {Button, TextField, Grid} from "@mui/material";

function LoginForm() {
    return (
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
                    <TextField id="outlined-basic" label="Username" variant="outlined" />
                </div>
                <div>
                    <TextField id="outlined-basic" label="password" variant="outlined" />
                </div>
                <Button variant="contained">Login</Button>
            </form>
        </Grid>
    );
}

export default LoginForm;