import './style/BlogPostWindow.css';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BlogPostWindow = ({ posts, isUserName, onDeletePost }) => {
    const navigate = useNavigate();

    const handleDeletePost = (postId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this post?');

        if (isConfirmed) {
            axios
                .post('/delete', { id: postId })
                .then(() => {
                    const updatedPosts = posts.filter((post) => post.id !== postId);
                    onDeletePost(updatedPosts); // Call the callback function
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const handleEditPost = (postId) => {
        navigate(`/edit/${postId}`);
    };

    const handleViewPost = (postId) => {
        navigate(`/posts/${postId}`);
    };

    const handleCustomAction = (postId) => {
        navigate(`/comment/${postId}`)
    };

    return (
        <div>
            {posts.map((post) => (
                <div className="blog-post-window" key={post.id}>
                    <div className="post-header">
                        <a
                            href={`/posts/${post.id}`}
                            className="title"
                            onClick={(event) => {
                                event.preventDefault();
                                handleViewPost(post.id);
                            }}
                        >
                            {post.title}
                        </a>
                        {post.user_id === isUserName && (
                            <div>
                                <button className="post-button" onClick={() => handleEditPost(post.id)}>Edit</button>
                                <button className="post-button" onClick={() => handleDeletePost(post.id)}>Delete</button>
                            </div>
                        )}
                        {isUserName !== "" && (
                            <button className="post-button" onClick={() => handleCustomAction(post.id)}>Comment</button>
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
