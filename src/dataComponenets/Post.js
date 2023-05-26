import React from "react";
import { Link } from "react-router-dom";
import BlogPost from "../BlogPost";
import {listItemsArray} from "../listItemsArray";




function Post({posts}) {

    const listItems = posts.map((post) => (
        <Link to={`/posts/${post.id}`} key={post.id}>
            <BlogPost title={post.title} content={post.body} />
        </Link>
    ));

  return <div className="posts">{listItems}</div>;
}

export default Post;
