import React from 'react';
import './BlogPostWindow.css';

const BlogPostWindow = ({ posts }) => {
    return (
        <div>
            {posts.map((post) => (
                <div className="blog-post-window" key={post.id}>
                    <h1 className="title">{post.title}</h1>
                    <p className="content">{post.body}</p>
                    <div className="footer">
                        <span className="published-date">{post.created_at}</span>
                        <span className="username">{post.id}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BlogPostWindow;