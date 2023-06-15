import React from "react";
import {useEffect, useState} from "react";
import "./style.css";
import LatestPosts from "./staticComponents/LatestPosts";
import PopularPosts from "./staticComponents/PopularPosts";
import axios from "axios";
import BlogPostWindow from "./dataComponenets/BlogPostWindow";
import {createTheme, ThemeProvider} from "@mui/material";
import {blue, green} from "@mui/material/colors";
import { Button } from "@mui/material";
import theme from "./theme"

function App() {
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
            <ThemeProvider theme={theme(blue)}>
            <main>
                <h1>This is my blog</h1>
                <div className="content">
                    <BlogPostWindow posts={posts}/>
                    <div className="sideposts">
                        <LatestPosts/>
                        <PopularPosts/>
                    </div>
                </div>
            </main>
            </ThemeProvider>
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