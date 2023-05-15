import {Button, TextField, Grid} from "@mui/material";
import React from "react";

const NewPost = () => {
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
                  defaultValue="Default Value"
              />
              <br />
              <Button variant="contained">Send</Button>
          </div>
      </Grid>
  );
};

export default NewPost;



