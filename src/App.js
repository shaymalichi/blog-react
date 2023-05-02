import React from "react";
import "./style.css";
import Navbar from "./Navbar";
import BlogPost from "./BlogPost";
import LatestPosts from "./LatestPosts";
import PopularPosts from "./PopularPosts";

function App() {
  const messeges = [
    { id: 1, title: "Blog post #1", msg: "My first blog post is all about my blog post and how to write a new post in my blog, you can find it here." },
    { id: 2, title: "Blog post #2", msg: "My second blog post is about my experiences with blogging and why I started my own blog, you can find it here.\n"},
    { id: 3, title: "Blog post #3", msg: "My third blog post is a tutorial on how to create a simple blog using HTML and CSS, you can find it here.\n"},
  ];

  const listItems = messeges.map((item) => (
    <BlogPost key={item.id} title={item.title} content={item.msg} />
  ));

  return (
    <div>
      <main>
        <h1>This is my blog</h1>
        <div className="content">
          <div className="posts">{listItems}</div>
          <div className="sideposts">
            <LatestPosts />
            <PopularPosts />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
