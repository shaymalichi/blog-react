import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom';
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
import axios from 'axios';
import EditPostComponent from './EditPostComponent';
import CommentOnPost from "./CommentOnPost";

const theme = createTheme({
    status: {
        danger: green[500],
    },
});

function MainApp() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isUsername, setTheUsername] = React.useState("");

    const handleLogout = () => {
        axios
            .post('/logout', { username: isUsername })
            .then(() => {
                setIsLoggedIn(false);
                setTheUsername("")
            })
            .catch(error => {
                console.error('Error occurred during logout:', error);
            });
    };


    return (
        <React.StrictMode>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <Navbar isLoggedIn={isLoggedIn} isUsername={isUsername} handleLogout={handleLogout}/>
                    <Routes>
                        <Route path="/" element={<App isUsername={isUsername}/>} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/new-post" element={<NewPost isUsername={isUsername}/>}  />
                        <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} setTheUsername={setTheUsername} />} />
                        <Route path="/posts/:id" element={<Post />} />
                        <Route path="/signup" element={<SignupForm />} />
                        <Route path="/edit/:postId" element={<EditPostComponent />} />
                        <Route path="/comment/:postId" element={<CommentOnPost isUsername={isUsername}/>} />
                    </Routes>
                </ThemeProvider>
            </BrowserRouter>
        </React.StrictMode>
    );
}

ReactDOM.render(<MainApp />, document.getElementById('root'));
