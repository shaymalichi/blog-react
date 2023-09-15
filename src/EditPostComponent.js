import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextareaAutosize } from '@mui/material';
import axios from "axios";
import { useParams } from 'react-router-dom';

const EditPostComponent = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [postContent, setPostContent] = useState('');

    const handleSave = () => {
        const isConfirmed = window.confirm('Are you sure you want to save the edit?');

        if (isConfirmed) {
            axios
                .post('/edit', { postid: postId, content: postContent })
                .then(() => {})
                .catch(error => {
                    console.error(error);
                });
            navigate(-1);
        }
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
            <Button variant="contained" color="primary" onClick={handleSave} style={{ marginRight: '8px' }}>
                Save
            </Button>
            <Button variant="outlined" color="primary" onClick={handleCancel}>
                Cancel
            </Button>
        </div>
    );
};

export default EditPostComponent;
