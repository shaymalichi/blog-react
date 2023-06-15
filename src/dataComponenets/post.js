import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";

const Post = () => {
    const {id} = useParams();

    const [posts,setPost] = useState([]) //{}

    useEffect(() => {
        const getPost = () => axios.post('http://localhost:5000/post' ,{'id' : Number(id)} ).then((res) => setPost(res.data));
        getPost();
    } , [])

    return  <div>
        {posts.filter(post => post.id === Number(id) ).map((post) => (
            <div className="blog-post-window" key={post.id}>
                <a href={`posts/${post.id}`} className="title">{post.title}</a>
                <p className="content">{post.body}</p>
                <div className="footer">
                    <span className="published-date">{post.created_at}</span>
                    <span className="username">{post.id}</span>
                </div>
            </div>
        ))}
    </div>
}

export default Post;