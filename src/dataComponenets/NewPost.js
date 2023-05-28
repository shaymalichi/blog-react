import React, { useEffect, useState } from "react";
import { Button, TextField, Grid, createTheme, ThemeProvider } from "@mui/material";
import { orange } from "@mui/material/colors";
import axios from "axios";


const theme = createTheme({
    status: {
        danger: orange[500],
    },
});

const NewPost = () => {
    const [posts, setPosts] = useState([]);
    const [postContent, setPostContent] = useState("");

    const sendData = (data) => {
        const postData = {
            user_id: 10041,
            id: 456,
            title: "bitch",
            body: data,
            created_at : new Date().toISOString().slice(0, 19).replace('T', ' ')

        };

        axios
            .post('http://localhost:5000/new-post', postData)
            .then((res) => {
                console.log("this is my data");
                console.log(res.data);
                console.log("this is my end");
                setPosts(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // useEffect(() => {
    //     const getData = () => {
    //         axios.post('http://localhost:5000/new-post', data).then((res) => {
    //             console.log(res.data);
    //             setPosts(res.data);
    //         });
    //     };
    //     getData().then((r) => {});
    // }, []);

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
                    id="outlined-multiline-static"
                    label="Enter Blog Post.."
                    multiline
                    rows={4}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                />
                <br />
                <ThemeProvider theme={theme}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: theme.status.danger }}
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
