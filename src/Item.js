import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ItemWindow from "./ItemWindow";
import CommentPostWindow from "./CommentPostWindow"; // Update or remove if not needed for the store

const Item = () => {
    const { id } = useParams();
    const [item, setItem] = useState({});
    const [comments, setComments] = useState([]); // Update or remove if not needed

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemResponse = await axios.get(`/items/${id}`);
                setItem(itemResponse.data);
                const commentsResponse = await axios.get(`/items/${id}/comments`); // Update or remove if not needed
                setComments(commentsResponse.data);
            } catch (error) {
                console.error("Error occurred while fetching data:", error);
            }
        };

        fetchData().then(r => {});
    }, [id]);

    return (
        <div>
            <h2>Item Details</h2>
            <ItemWindow items={[item]} isUserName={""} />
            <h2>Comments</h2> {/* Update or remove if not needed */}
            <CommentPostWindow comments={comments} /> {/* Update or remove if not needed */}
        </div>
    );
};

export default Item;
