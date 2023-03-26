import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user }) {
  const [showAddRepoForm, setShowAddRepoForm] = useState(false);
  const [response, setResponse] = useState(null);
  const handleAddRepoFormToggle = () => setShowAddRepoForm(!showAddRepoForm);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const repoLink = document.getElementById('repoLink').value;
    const response = await fetch('http://localhost:3000/repo/directoryTree', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoLink, user }),
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
      <Link to="/" id="site-title">
        CodeSource
      </Link>
      <div className="navbar-links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/events">Events</Link>
          </li>
          <li>
            <Link to="/explore">Explore</Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/myAccount">My account</Link>
              </li>
              <li className="add-repo-container">
                <button type="button" className="add-repo-btn" onClick={handleAddRepoFormToggle}>
                  Add repository
                </button>
                {showAddRepoForm && (
                  <div className="add-repo-form">
                    <form onSubmit={handleSubmit}>
                      <input
                        type="text"
                        placeholder="Repository Name"
                        id="repoLink"
                        name="repoLink"
                      />
                      <button type="submit">Submit</button>
                    </form>
                  </div>
                )}
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
