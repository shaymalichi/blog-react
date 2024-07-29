import React from "react";
import {useEffect, useState} from "react";
import "./style/style.css";
import LatestPosts from "./staticComponents/LatestPosts";
import PopularPosts from "./staticComponents/PopularPosts";
import axios from "axios";
import BlogPostWindow from "./BlogPostWindow";
import {ThemeProvider} from "@mui/material";
import {blue} from "@mui/material/colors";
import theme from "./style/theme"

function App({isUsername}) {
    const [items, setItems] = useState([])

    useEffect( () => {
         const getData = () => axios.get('/items').then(res => {
             console.log(res.data)
             setItems(res.data)
         })
        getData().then(r => {})
    }, [])

    return (

        <div>
            <ThemeProvider theme={theme(blue)}>
            <main>
                <h1>This is my online store</h1>
                <div className="content">
                    <BlogPostWindow posts={items} isUserName={isUsername} onDeletePost={setItems} />
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
