import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import About from './staticComponents/about';
import Contact from './staticComponents/Contact';
import NewPost from './NewPost';
import Navbar from './Navbar';
import LoginForm from "./LoginForm";
import { createTheme, ThemeProvider } from "@mui/material";
import { green } from "@mui/material/colors";
import Post from "./post";
import SignupForm from "./SignUpForm";

const theme = createTheme({
    status: {
        danger: green[500],
    },
});

function MainApp() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false); // Updated
    const [isUsername, setTheUsername] = React.useState("");
    return (
        <React.StrictMode>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <Navbar isLoggedIn={isLoggedIn} isUsername={isUsername}/>
                    <Routes>
                        <Route path="/" element={<App />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/new-post" element={<NewPost />} />
                        <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} setTheUsername={setTheUsername} />}/>
                        <Route path="/posts/:id" element={<Post />} />
                        <Route path="/signup" element={<SignupForm />} />
                    </Routes>
                </ThemeProvider>
            </BrowserRouter>
        </React.StrictMode>
    );
}

ReactDOM.render(<MainApp />, document.getElementById('root'));
