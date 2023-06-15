import { useParams } from 'react-router-dom';
import React from 'react';
import {listItemsArray} from "./listItemsArray";

const IdRender = () => {
    const { id } = useParams();
    const {title, msg} = listItemsArray[id-1]
    return (
        <div className="post">
            <h2>{title}</h2>
            <p>{msg}</p>
        </div>
    );
};

export default IdRender;