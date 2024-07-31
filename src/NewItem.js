import React, { useState } from "react";
import { Button, TextField, Grid, ThemeProvider, Container, Typography } from "@mui/material";
import axios from "axios";
import theme from './style/theme';

const NewItem = ({ isUsername }) => {
    const [itemName, setItemName] = useState("");
    const [itemDescription, setItemDescription] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [itemStock, setItemStock] = useState("");
    const [itemImageUrl, setItemImageUrl] = useState("");

    const sendData = () => {
        const itemData = {
            user_id: isUsername,
            name: itemName,
            description: itemDescription,
            price: parseFloat(itemPrice),
            stock: parseInt(itemStock),
            image_url: itemImageUrl,
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        axios
            .post('/add-item', itemData)
            .then((res) => {
                alert("Item added successfully");
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <Container>
            <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center">
                <Grid item>
                    <Typography variant="h4">New Item</Typography>
                </Grid>
                <Grid item>
                    <TextField
                        label="Enter Item Name"
                        variant="outlined"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label="Enter Description"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={itemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label="Enter Price"
                        variant="outlined"
                        value={itemPrice}
                        onChange={(e) => setItemPrice(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label="Enter Stock"
                        variant="outlined"
                        value={itemStock}
                        onChange={(e) => setItemStock(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label="Enter Image URL"
                        variant="outlined"
                        value={itemImageUrl}
                        onChange={(e) => setItemImageUrl(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item>
                    <ThemeProvider theme={theme()}>
                        <Button variant="contained" onClick={sendData}>Add Item</Button>
                    </ThemeProvider>
                </Grid>
            </Grid>
        </Container>
    );
};

export default NewItem;
