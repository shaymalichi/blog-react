import { Link } from 'react-router-dom';

function Navbar({ isLoggedIn, isUsername, handleLogout }) {
  if (!isLoggedIn) {
    return (
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </ul>
        </nav>
    );
  } else {
    return (
        <nav>
          <div>Hi, {isUsername}</div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            {isUsername === 'admin' && (
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
            )}
            <li>
              <Link to="/" onClick={handleLogout}>Logout</Link>
            </li>
          </ul>
        </nav>
    );
  }
}

export default Navbar;
