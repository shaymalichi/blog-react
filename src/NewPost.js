import {Button, TextField} from "@mui/material";
import React from "react";

const NewPost = () => {
  return (
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
  );
};

export default NewPost;
