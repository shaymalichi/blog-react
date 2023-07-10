import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogPostWindow from "./BlogPostWindow";
import CommentPostWindow from "./CommentPostWindow";

const Post = () => {
    const { id } = useParams();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);

    useEffect(() => {
        axios
            .get(`/posts/${id}`)
            .then((response) => {
                setPost(response.data);
            })
            .catch((error) => {
                console.error("Error occurred while fetching post:", error);
            });
        axios
            .get(`/comments/${id}`)
            .then((response) => {
                setComments(response.data);
            })
            .catch((error) => {
                console.error("Error occurred while fetching comments:", error);
            });
    }, [id]);

    return (
        <div>
            <h2>Post Details</h2>
            <BlogPostWindow posts={[post]} isUserName={""} />
            <h2>Comments</h2>
            <CommentPostWindow comments={comments} />
        </div>
    );
};

export default Post;
