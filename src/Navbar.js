import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

function Navbar({ isLoggedIn, isUsername, handleLogout }) {
    if (!isLoggedIn) {
        return (
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Online Store
                    </Typography>
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    <Button color="inherit" component={Link} to="/readme.html">ReadMe</Button>
                    <Button color="inherit" component={Link} to="/llm.html">LLM</Button>
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                    <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
                </Toolbar>
            </AppBar>
        );
    } else {
        return (
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Online Store
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Hi, {isUsername}
                    </Typography>
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    <Button color="inherit" component={Link} to="/cart">Cart</Button>
                    {isUsername !== 'admin' && (
                        <>
                            <Button color="inherit" component={Link} to="/change-username">Change Username</Button>
                            <Button color="inherit" component={Link} to="/past-orders">Past Orders</Button>
                            <Button color="inherit" component={Link} to="/wishlist">Wishlist</Button>
                            <Button color="inherit" component={Link} to="/reviews">Reviews</Button>
                        </>
                    )}
                    {isUsername === 'admin' && (
                        <>
                            <Button color="inherit" component={Link} to="/admin">Admin</Button>
                            <Button color="inherit" component={Link} to="/add-item">Add Item</Button>
                        </>
                    )}
                    <Button color="inherit" component={Link} to="/" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
        );
    }
}

export default Navbar;
