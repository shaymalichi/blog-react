import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextareaAutosize } from '@mui/material';
import axios from "axios";
import { useParams } from 'react-router-dom';

const EditPostComponent = ({isUsername}) => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [postContent, setPostContent] = useState('');

    const handleSave = (postContent) => {
        axios
            .post('/comments', { postid: postId, content: postContent, user: isUsername})
            .then(() => {})
            .catch(error => {
                console.error(error);
            });
        navigate(-1);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div>
            <TextareaAutosize
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rowsMin={5}
                placeholder="Enter your post content"
                style={{ width: '100%', marginBottom: '16px' }}
            />
            <Button variant="contained" color="primary" onClick={() => handleSave(postContent)} style={{ marginRight: '8px' }}>
                Save
            </Button>
            <Button variant="outlined" color="primary" onClick={handleCancel}>
                Cancel
            </Button>
        </div>
    );
};

export default EditPostComponent;
