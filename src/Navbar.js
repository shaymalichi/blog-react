import {Link} from 'react-router-dom';

function Navbar({ isLoggedIn, isUsername, handleLogout }) {
  if (!isLoggedIn) {
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
              <Link to="/new-post">New Post</Link>
            </li>
            <li>
              <Link to="login">login</Link>
            </li>

            <li>
              <Link to="Signup">SignUp</Link>
            </li>
          </ul>
        </nav>
    );
  }
  else {
    console.log(isLoggedIn)
    return (
        <nav>
          <div>hi {isUsername}</div>
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
              <Link to="/new-post">New Post</Link>
            </li>
            <li>
              <Link to="/" onClick={handleLogout}>logout</Link>
            </li>
          </ul>
        </nav>
    );
  }

}

export default Navbar;