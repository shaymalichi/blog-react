import React from "react";
import "./style.css";
import LatestPosts from "./LatestPosts";
import PopularPosts from "./PopularPosts";
import Post from "./Post";



function App() {


  return (
    <div>
      <main>
        <h1>This is my blog</h1>
        <div className="content">
          <Post />
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
