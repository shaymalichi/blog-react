import React from 'react';
import './style/CommentPostWindow.css';


const CommentPostWindow = ({ comments }) => {
    return (
        <div>
            {comments.map((comment) => (
                <div className="comment-post-window" key={comment.id}>
                    <div className="comment-header">
                        <span className="username">{comment.user_id}</span>
                    </div>
                    <p className="content">{comment.body}</p>
                </div>
            ))}
        </div>
    );
};

export default CommentPostWindow;
