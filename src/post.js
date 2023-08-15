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
        const fetchData = async () => {
            try {
                const postResponse = await axios.get(`/posts/${id}`);
                setPost(postResponse.data);

                const commentsResponse = await axios.get(`/comments/${id}`);
                setComments(commentsResponse.data);
            } catch (error) {
                console.error("Error occurred while fetching data:", error);
            }
        };

        fetchData().then(r => {});
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
