import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogPostWindow from "./BlogPostWindow";

const Post = () => {
    const { id } = useParams();
    const [post, setPost] = useState({});

    useEffect(() => {
        axios.get('/sessions')
    })


    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/posts/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error('Error occurred while fetching post:', error);
            }
        };
        fetchPost();
    }, [id]);

    return (
        <div>
            <h2>Post Details</h2>
            <BlogPostWindow posts={[post]} isUserName={post.user_id} />
        </div>
    );
};

export default Post;
