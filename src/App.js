import React from "react";
import {useEffect, useState} from "react";
import "./style.css";
import LatestPosts from "./staticComponents/LatestPosts";
import PopularPosts from "./staticComponents/PopularPosts";
import axios from "axios";
import BlogPostWindow from "./dataComponenets/BlogPostWindow";


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