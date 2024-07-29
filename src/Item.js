import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ItemWindow from "./ItemWindow";

const Item = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null); // Start with null to handle loading state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemResponse = await axios.get(`/items/${id}`);
                setItem(itemResponse.data);
            } catch (error) {
                console.error("Error occurred while fetching data:", error);
            }
        };

        fetchData().then(r => {});
    }, [id]);

    if (!item) {
        return <div>Loading...</div>; // Show loading message while fetching data
    }

    return (
        <div>
            <h2>Item Details</h2>
            <ItemWindow items={[item]} isUserName={""} />
        </div>
    );
};

export default Item;
