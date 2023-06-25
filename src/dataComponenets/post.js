import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";

const Post = () => {
    const { id } = useParams();

    const [post, setPost] = useState({});

    useEffect(() => {
        const getPost = async () => {
            try {
                const response = await axios.get(`/posts/${id}`);
                setPost(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        getPost();
    }, [id]);

    return (
        <div>
            {post && (
                <div className="blog-post-window" key={post.id}>
                    <a href={`posts/${post.id}`} className="title">{post.title}</a>
                    <p className="content">{post.body}</p>
                    <div className="footer">
                        <span className="published-date">{post.created_at}</span>
                        <span className="username">{post.user_id}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;