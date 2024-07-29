import React, { useState } from "react";
import { Button, TextField, Grid, ThemeProvider } from "@mui/material";
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
                console.log("Item added successfully");
                console.log(res.data);
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
                <h2>New Item</h2>
                <TextField
                    id="outlined-basic"
                    label="Enter Item Name"
                    variant="outlined"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                />
                <br />
                <TextField
                    id="outlined-multiline-static"
                    label="Enter Description"
                    multiline
                    rows={4}
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                />
                <br />
                <TextField
                    id="outlined-basic"
                    label="Enter Price"
                    variant="outlined"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                />
                <br />
                <TextField
                    id="outlined-basic"
                    label="Enter Stock"
                    variant="outlined"
                    value={itemStock}
                    onChange={(e) => setItemStock(e.target.value)}
                />
                <br />
                <TextField
                    id="outlined-basic"
                    label="Enter Image URL"
                    variant="outlined"
                    value={itemImageUrl}
                    onChange={(e) => setItemImageUrl(e.target.value)}
                />
                <br />
                <ThemeProvider theme={theme()}>
                    <Button
                        variant="contained"
                        onClick={sendData}
                    >
                        Add Item
                    </Button>
                </ThemeProvider>
            </div>
        </Grid>
    );
};

export default NewItem;
