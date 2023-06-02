import React from "react";
import {useEffect, useState} from "react";
import "./style.css";
import LatestPosts from "./staticComponents/LatestPosts";
import PopularPosts from "./staticComponents/PopularPosts";
import axios from "axios";
import BlogPostWindow from "./dataComponenets/BlogPostWindow";
import {createTheme, ThemeProvider} from "@mui/material";
import {green} from "@mui/material/colors";
import { Button } from "@mui/material";


const theme = createTheme({
    status: {
        danger: green[500],
    },
});

function App() {
    const theme = createTheme({
        // Customize your theme here
        palette: {
            primary: {
                main: "#f44336",
            },
            secondary: {
                main: "#2196f3",
            },
        },
    });


    const [posts, setPosts] = useState([])

    useEffect( () => {
         const getData = () => axios.get('http://localhost:5000/').then(res => {
             console.log(res.data)
             setPosts(res.data)
         })
        getData().then(r => {})
    }, [])

    return (

        <div>
            <main>
                <ThemeProvider theme={theme}>
                <h1>This is my blog</h1>
                <div className="content">
                    <BlogPostWindow posts={posts}/>
                    <div className="sideposts">
                        <LatestPosts/>
                        <PopularPosts/>
                    </div>
                </div>
            </ThemeProvider>
            </main>
        </div>

    );
}

export default App;


//temp
// {posts?.map(post => {
//     return(
//         <div>
//             id : {post.user_id}
//         </div>
//     )
// })}