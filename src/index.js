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
import EditItemComponent from './EditItemComponent'; // Renamed component
import Cart from './Cart'; // New component
import Admin from './Admin'; // New component
import NewItem from './NewItem'; // New component

function MainApp() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isUsername, setTheUsername] = React.useState("");

    const handleLogout = () => {
        axios.post('/logout', { username: isUsername })
            .then(() => {
                setIsLoggedIn(false);
                setTheUsername("");
            })
            .catch(error => {
                console.error('Error occurred during logout:', error);
            });
    };

    return (
        <React.StrictMode>
            <BrowserRouter>
                <Navbar isLoggedIn={isLoggedIn} isUsername={isUsername} handleLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={<App isUsername={isUsername} />} />
                    <Route path="/about" element={<About />} /> {/* Update or remove if not needed */}
                    <Route path="/contact" element={<Contact />} /> {/* Update or remove if not needed */}
                    <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} setTheUsername={setTheUsername} />} />
                    <Route path="/signup" element={<SignupForm />} />
                    <Route path="/items/:id" element={<Item />} />
                    <Route path="/edit/:itemId" element={<EditItemComponent isUsername={isUsername} />} />
                    <Route path="/cart" element={<Cart isUsername={isUsername} />} />
                    <Route path="/admin" element={<Admin isUsername={isUsername} />} />
                    <Route path="/new-item" element={isUsername === 'admin' ? <NewItem isUsername={isUsername} /> : <App isUsername={isUsername} />} />
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    );
}

ReactDOM.render(<MainApp />, document.getElementById('root'));
