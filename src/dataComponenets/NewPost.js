import React, { useEffect, useState } from "react";
import { Button, TextField, Grid, createTheme, ThemeProvider } from "@mui/material";
import axios from "axios";
import theme from '../theme';

const NewPost = () => {
    const [posts, setPosts] = useState([]);
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");

    const sendData = (data) => {
        const postData = {
            user_id: "shay810",
            title: postTitle,
            body: data,
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        axios
            .post('/new-post', postData)
            .then((res) => {
                console.log("this is my data");
                console.log(res.data);
                console.log("this is my end");
                //setPosts(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
        >
            <div>
                <h2>New Post</h2>
                <TextField
                    id="outlined-basic"
                    label="Enter Title"
                    variant="outlined"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                />
                <br />
                <TextField
                    id="outlined-multiline-static"
                    label="Enter Blog Post.."
                    multiline
                    rows={4}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                />
                <br />
                <ThemeProvider theme={theme()}>
                    <Button
                        variant="contained"

                        onClick={() => sendData(postContent)}
                    >
                        Send
                    </Button>
                </ThemeProvider>
            </div>
        </Grid>
    );
};

export default NewPost;
