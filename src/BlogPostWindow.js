import React from 'react';
import './style/BlogPostWindow.css';

const BlogPostWindow = ({ posts, isUserName }) => {
    const handleDeletePost = (postId) => {
        // Logic for deleting the post goes here
        console.log(`Delete post with ID: ${postId}`);
    };

    return (
        <div>
            {posts.map((post) => (
                <div className="blog-post-window" key={post.id}>
                    <div className="post-header">
                        <a href={`posts/${post.id}`} className="title">{post.title}</a>
                        {post.user_id === isUserName && (
                            <button className="post-button" onClick={() => handleDeletePost(post.id)}>X</button>
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
