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
    const repoName = document.getElementById('repoName').value;
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/repo/directoryTree`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoName, user }),
      credentials: 'include',
    });
    const responseData = await response.json();
    console.log(responseData);
    setResponse(responseData);
    // history.push("/repository", { response: responseData });
    navigate(`${user.details.username}/${repoName}/repository`);
  };

  return (
    <nav className="navbar">
      <Link to="/" id="site-title">
        CodeSource
      </Link>

      <div className="navbar-links">
        <ul>
          <li>
            <Link to="/events">Events</Link>
          </li>
          <li>
            <Link to="/explore">Explore</Link>
          </li>
          {user && (
            <li>
              <Link to="/addRepos">Add repos</Link>
            </li>
          )}
        </ul>
      </div>

      {!user && (
        <button
          type="button"
          className="connection"
          onClick={() => (window.location.href = `${process.env.REACT_APP_SERVER_URL}/auth/github`)}
        >
          Login with Github
        </button>
      )}
      {user && (
        <h2>
          Hello,
          <Link to="/myAccount" className="navUsername">
            {user.details.displayName ? user.details.displayName : user.details.username}
          </Link>
        </h2>
      )}
    </nav>
  );
}

export default Navbar;
