import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Navbar({ user }) {

  const [showAddRepoForm, setShowAddRepoForm] = useState(false);
  const [response, setResponse] = useState(null);
  const handleAddRepoFormToggle = () => setShowAddRepoForm(!showAddRepoForm);
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    const repoLink = document.getElementById("repoLink").value;
    const response = await fetch("http://localhost:3000/repo/directoryTree", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoLink, user }),
      credentials: "include"
    });
    const responseData = await response.json();
    console.log(responseData);
    setResponse(responseData);
    // history.push("/repository", { response: responseData });
    navigate("/repository");
  };

  return (
    <nav className="navbar">
      <h1>CodeSource</h1>

      <div className="navbar-links">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="events">Events</a></li>
          <li><a href="#">Explore</a></li>
          {user && (
            <>
              <li><a href="myAccount">My account</a></li>
              <li className="add-repo-container">
                <button
                  type="button"
                  className="add-repo-btn"
                  onClick={handleAddRepoFormToggle}
                >
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
          onClick={() => window.location.href = 'http://localhost:3000/auth/github'}
        >
          Login with Github
        </button>
      )}
      {user && (
        <h2>Hello, {user.displayName}</h2>
      )}
    </nav>
  );
}

export default Navbar;
