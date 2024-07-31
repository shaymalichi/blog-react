import React, { useState, useEffect } from "react";
import "./style/style.css";
import axios from "axios";
import ItemWindow from "./ItemWindow";
import { ThemeProvider } from "@mui/material";
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
        <div>
            <ThemeProvider theme={theme(blue)}>
                <main>
                    <h1>Welcome to My Online Store</h1>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="content">
                        <ItemWindow items={items} isUserName={isUsername} onDeleteItem={null} context="home" />
                        <div className="sideposts">
                        </div>
                    </div>
                </main>
            </ThemeProvider>
        </div>
    );
}

export default App;
