import {Button, TextField, Grid, createTheme, ThemeProvider} from "@mui/material";
import React from "react";
import {orange} from "@mui/material/colors";


const theme = createTheme({
    status: {
        danger: orange[500],
    },
});

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
              <ThemeProvider theme={theme}>
                  <Button variant="contained" sx={{ backgroundColor: theme.status.danger }}>Send</Button>
              </ThemeProvider>
          </div>
      </Grid>
  );
};

export default NewPost;



