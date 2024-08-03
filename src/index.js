import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import Navbar from './Navbar';
import LoginForm from "./LoginForm";
import SignupForm from "./SignUpForm";
import axios from 'axios';
import Item from "./Item";
import EditItemComponent from './EditItemComponent';
import Cart from './Cart';
import Admin from './Admin';
import NewItem from './NewItem';
import ThankYou from './ThankYou';
import AddItemComponent from './AddItemComponent';
import ChangeUsername from './ChangeUsername';
import PastOrders from './PastOrders';
import Wishlist from './Wishlist';
import Reviews from './Reviews';
import Readme from './Readme';

const theme = createTheme();

function MainApp() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isUsername, setTheUsername] = React.useState("");

    React.useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            setIsLoggedIn(true);
            setTheUsername(savedUsername);
        }
    }, []);

    const handleLogout = () => {
        axios.post('/logout', { username: isUsername })
            .then(() => {
                setIsLoggedIn(false);
                setTheUsername("");
                localStorage.removeItem('username');
                window.location.href = '/login';
            })
            .catch(error => {
                console.error('Error occurred during logout:', error);
            });
    };

    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Navbar key={isUsername} isLoggedIn={isLoggedIn} isUsername={isUsername} handleLogout={handleLogout} />
                    <Routes>
                        <Route path="/" element={<App isUsername={isUsername} />} />
                        <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} setTheUsername={setTheUsername} />} />
                        <Route path="/signup" element={<SignupForm />} />
                        <Route path="/items/:id" element={<Item isUsername={isUsername} />} />
                        <Route path="/edit/:itemId" element={<EditItemComponent isUsername={isUsername} />} />
                        <Route path="/cart" element={<Cart isUsername={isUsername} />} />
                        <Route path="/admin" element={<Admin isUsername={isUsername} />} />
                        <Route path="/new-item" element={isUsername === 'admin' ? <NewItem isUsername={isUsername} /> : <App isUsername={isUsername} />} />
                        <Route path="/add-item" element={isUsername === 'admin' ? <AddItemComponent isUsername={isUsername} /> : <App isUsername={isUsername} />} />
                        <Route path="/thank-you" element={<ThankYou />} />
                        <Route path="/past-orders" element={<PastOrders isUsername={isUsername} />} />
                        <Route path="/wishlist" element={<Wishlist />} /> {/* New route */}
                        <Route path="/reviews" element={<Reviews />} /> {/* New route */}
                        <Route path="/change-username" element={isLoggedIn && isUsername !== 'admin' ? <ChangeUsername setTheUsername={setTheUsername} /> : <App isUsername={isUsername} />} />
                        <Route path="/readme.html" element={<Readme />} /> {/* New route */}
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </React.StrictMode>
    );
}

ReactDOM.render(<MainApp />, document.getElementById('root'));
