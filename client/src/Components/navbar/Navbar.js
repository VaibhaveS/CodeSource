import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, page }) {
  const [showAddRepoForm, setShowAddRepoForm] = useState(false);
  const [response, setResponse] = useState(null);
  const handleAddRepoFormToggle = () => setShowAddRepoForm(!showAddRepoForm);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const repoName = document.getElementById('repoName').value;
    const response = await fetch('http://localhost:3000/repo/directoryTree', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoName, user }),
      credentials: 'include',
    });
    const responseData = await response.json();
    console.log(responseData);
    setResponse(responseData);
    // history.push("/repository", { response: responseData });
    navigate('/repository');
  };

  return (
    <nav className="navbar">
      <h1 class="title">CodeSource</h1>

      <div className="navbar-links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/events">Events</Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/myAccount">My account</Link>
              </li>
              <li>
                <Link to="/Repository">Repository</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {!user && (
        <button
          type="button"
          className="connection"
          onClick={() => (window.location.href = 'http://localhost:3000/auth/github')}
        >
          Login with Github
        </button>
      )}
      {user && (
        <h2>
          Hello, {user.details.displayName ? user.details.displayName : user.details.username}
        </h2>
      )}
    </nav>
  );
}

export default Navbar;
