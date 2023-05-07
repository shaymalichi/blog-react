import React from 'react';
import {Button} from "@mui/material";


function LoginForm() {
    return (
        <form>
            <div>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" />
            </div>
            <Button variant="contained">Login</Button>
        </form>
    );
}

export default LoginForm;