import React from "react";
import { Link } from "react-router-dom";
import BlogPost from "./BlogPost";
import {listItemsArray} from "./listItemsArray";
function Post() {

  const listItems = listItemsArray.map((item) => (
      <Link to={`/posts/${item.id}`} key={item.id}>
        <BlogPost title={item.title} content={item.msg} />
      </Link>
  ));

  return <div className="posts">{listItems}</div>;
}

export default Post;
