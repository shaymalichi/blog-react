import './style/BlogPostWindow.css';
import axios from 'axios';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BlogPostWindow = ({ posts, isUserName, onDeletePost }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleDeletePost = (postId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');

        if (isConfirmed) {
            axios
                .delete(`/items/${postId}`, { data: { id: postId, user: isUserName } })
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
        navigate(`/items/${postId}`);
    };

    const handleCustomAction = (postId) => {
        navigate(`/comment/${postId}`);
    };

    return (
        <div>
            {posts.map((post) => (
                <div className="blog-post-window" key={post.id}>
                    <div className="post-header">
                        <a
                            href={`/items/${post.id}`}
                            className="title"
                            onClick={(event) => {
                                event.preventDefault();
                                handleViewPost(post.id);
                            }}
                        >
                            {post.name}
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
                    <p className="content">{post.description}</p>
                    <div className="footer">
                        <span className="price">Price: ${post.price}</span>
                        <span className="stock">Stock: {post.stock}</span>
                        {post.image_url && <img src={post.image_url} alt={post.name} className="item-image" />}
                        <span className="published-date">{post.created_at}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BlogPostWindow;
