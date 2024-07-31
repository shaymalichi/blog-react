import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import About from './staticComponents/about'; // Update or remove if not needed
import Contact from './staticComponents/Contact'; // Update or remove if not needed
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
                window.location.href = '/login'; // Redirect to the login page
            })
            .catch(error => {
                console.error('Error occurred during logout:', error);
            });
    };

    return (
        <React.StrictMode>
            <BrowserRouter>
                <Navbar key={isUsername} isLoggedIn={isLoggedIn} isUsername={isUsername} handleLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={<App isUsername={isUsername} />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} setTheUsername={setTheUsername} />} />
                    <Route path="/signup" element={<SignupForm />} />
                    <Route path="/items/:id" element={<Item isUsername={isUsername} />} />
                    <Route path="/edit/:itemId" element={<EditItemComponent isUsername={isUsername} />} />
                    <Route path="/cart" element={<Cart isUsername={isUsername} />} />
                    <Route path="/admin" element={<Admin isUsername={isUsername} />} />
                    <Route path="/new-item" element={isUsername === 'admin' ? <NewItem isUsername={isUsername} /> : <App isUsername={isUsername} />} />
                    <Route path="/add-item" element={isUsername === 'admin' ? <AddItemComponent isUsername={isUsername} /> : <App isUsername={isUsername} />} />
                    <Route path="/thank-you" element={<ThankYou />} />
                    <Route path="/change-username" element={isLoggedIn && isUsername !== 'admin' ? <ChangeUsername setTheUsername={setTheUsername} /> : <App isUsername={isUsername} />} />
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    );
}

ReactDOM.render(<MainApp />, document.getElementById('root'));
