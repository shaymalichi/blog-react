import { Link } from 'react-router-dom';

function Navbar() {
  return (
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About Me</Link>
          </li>
          <li>
            <Link to="/contact">Contact Me</Link>
          </li>
          <li>
            <a href="/post">Post</a>
          </li>
          <li>
            <Link to="/new-post">New Post</Link>
          </li>
          <li>
            <Link to="login">login</Link>
          </li>
        </ul>
      </nav>
  );
}

export default Navbar;