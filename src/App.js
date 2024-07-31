import React, { useState, useEffect } from "react";
import axios from "axios";
import ItemWindow from "./ItemWindow";
import { ThemeProvider } from "@mui/material/styles";
import { Container, Typography, TextField, Box } from "@mui/material";
import { blue } from "@mui/material/colors";
import theme from "./style/theme";

function App({ isUsername }) {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const getData = () => {
            axios.get('/items', { params: { search: searchTerm } })
                .then(res => {
                    console.log(res.data);
                    setItems(res.data);
                });
        };
        getData();
    }, [searchTerm]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <ThemeProvider theme={theme(blue)}>
            <Container>
                <Typography variant="h2" gutterBottom>
                    Welcome to My Online Store
                </Typography>
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Search items..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Box>
                <Box>
                    <ItemWindow items={items} isUserName={isUsername} onDeleteItem={null} context="home" />
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default App;
