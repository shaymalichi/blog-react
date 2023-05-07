import { useParams } from 'react-router-dom';
import React from 'react';
import BlogPost from "./BlogPost";
import {listItemsArray} from "./listItemsArray";

const IdRender = () => {
    const { id } = useParams();
    const {title, msg} = listItemsArray[id-1]
    return (
        <div>
            <BlogPost title={title} content={msg} />
        </div>
    );
};

export default IdRender;