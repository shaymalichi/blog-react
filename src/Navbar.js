function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/about">About Me</a>
        </li>
        <li>
          <a href="/contact">Contact Me</a>
        </li>
        <li>
          <a href="/post">Post</a>
        </li>
        <li>
          <a href="/new-post">New Post</a>
        </li>
        <li>
          <a id="login">login</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
