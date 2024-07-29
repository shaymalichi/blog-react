import React from "react";
import {useEffect, useState} from "react";
import "./style/style.css";
import axios from "axios";
import ItemWindow from "./ItemWindow";
import {ThemeProvider} from "@mui/material";
import {blue} from "@mui/material/colors";
import theme from "./style/theme"

function App({isUsername}) {
    const [items, setItems] = useState([])

    useEffect( () => {
         const getData = () => axios.get('/items').then(res => {
             console.log(res.data)
             setItems(res.data)
         })
        getData().then(r => {})
    }, [])

    return (
        <div>
            <ThemeProvider theme={theme(blue)}>
                <main>
                    <h1>Welcome to My Online Store</h1>
                    <div className="content">
                        <ItemWindow items={items} isUserName={isUsername} onDeleteItem={setItems} />
                        <div className="sideposts">
                        </div>
                    </div>
                </main>
            </ThemeProvider>
        </div>
    );
}

export default App;
