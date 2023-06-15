import React from 'react';
import {Button, TextField, Grid, ThemeProvider, createTheme} from "@mui/material";
import theme from './theme';
import {blue, green} from "@mui/material/colors";



function LoginForm() {
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
                        <TextField id="outlined-basic" label="Username" variant="outlined" />
                    </div>
                    <div>
                        <TextField id="outlined-basic" label="password" variant="outlined" />
                    </div>
                    <ThemeProvider theme={theme(blue)}>
                        <Button variant="contained" >Login</Button>
                    </ThemeProvider>
                </form>
            </Grid>
        </ThemeProvider>

    );
}

export default LoginForm;
