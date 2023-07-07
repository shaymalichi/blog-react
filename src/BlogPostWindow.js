import './style/BlogPostWindow.css';
import axios from "axios";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BlogPostWindow = ({ posts, isUserName }) => {
    const navigate = useNavigate();
    const [deletedPostId, setDeletedPostId] = useState(null);

    const handleDeletePost = (postId) => {
        axios
            .post('/delete', { id: postId })
            .then(() => {
                setDeletedPostId(postId)
                posts = posts.filter((post) => post.id !== postId);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleEditPost = (postId) => {
        navigate(`/edit/${postId}`);
    };

    return (
        <div>
            {posts.map((post) => (
                <div className="blog-post-window" key={post.id}>
                    <div className="post-header">
                        <a href={`posts/${post.id}`} className="title">{post.title}</a>
                        {post.user_id === isUserName && (
                            <div>
                                <button className="post-button" onClick={() => handleEditPost(post.id)}>Edit</button>
                                <button className="post-button" onClick={() => handleDeletePost(post.id)}>X</button>
                            </div>
                        )}
                    </div>
                    <p className="content">{post.body}</p>
                    <div className="footer">
                        <span className="published-date">{post.created_at}</span>
                        <span className="username">{post.user_id}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BlogPostWindow;
