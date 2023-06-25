import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import About from './staticComponents/about';
import Contact from './staticComponents/Contact';
import NewPost from './dataComponenets/NewPost';
import Navbar from './staticComponents/Navbar';
import LoginForm from "./LoginForm";
import IdRender from "./IdRender";
import {createTheme, ThemeProvider} from "@mui/material";
import {green} from "@mui/material/colors";
import Post from "./dataComponenets/post";
import SignupForm from "./dataComponenets/SignUpForm";

const theme = createTheme({
    status: {
        danger: green[500],
    },
});

ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
          <ThemeProvider theme={theme}>


        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/new-post" element={<NewPost />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/signup" element={<SignupForm />} />

        </Routes>
          </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')

);