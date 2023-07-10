import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogPostWindow from "./BlogPostWindow";

const Post = () => {
    const { id } = useParams();
    const [post, setPost] = useState({});

    useEffect(() => {
        axios.get(`/posts/${id}`)
            .then(response => {
                setPost(response.data);
            })
            .catch(error => {
                console.error('Error occurred while fetching post:', error);
            });
    }, [id]);

    return (
        <div>
            <h2>Post Details</h2>
            <BlogPostWindow posts={[post]} isUserName={""} />
        </div>
    );
};

export default Post;
