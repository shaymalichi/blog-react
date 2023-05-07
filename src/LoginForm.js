import React from 'react';
import {Button, TextField} from "@mui/material";


function LoginForm() {
    return (
        <form>
            <div>
                <TextField id="outlined-basic" label="Username" variant="outlined" />
            </div>
            <div>
                <TextField id="outlined-basic" label="password" variant="outlined" />
            </div>
            <Button variant="contained">Login</Button>
        </form>
    );
}

export default LoginForm;