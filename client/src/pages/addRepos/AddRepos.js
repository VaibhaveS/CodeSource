import React, { useEffect, useState } from 'react';
import { FaStar, FaCodeBranch, FaCircle, FaBook } from 'react-icons/fa';

const RepoList = () => {
  const [repositories, setRepositories] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const getResponse = async () => {
      const response = await fetch(`http://localhost:3000/repo/github-repos`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const repos = await response.json();
      console.log(repos);
      setRepositories(repos);
    };
    getResponse();
  }, [page]);

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  const randomColor = () => {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`;
  };

  const handleClick = async (event) => {
    if (event.is_codesource) {
      window.location.href = `http://localhost:3006/${event.owner.login}/${event.name}/repository`;
    } else {
      const response = await fetch('http://localhost:3000/repo/directoryTree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoName: event.name, username: event.owner.login }),
        credentials: 'include',
      });
      const responseData = await response.json();
      if (responseData) {
        window.location.href = `http://localhost:3006/${event.owner.login}/${event.name}/repository`;
      }
    }
  };

  return (
    <div>
      {repositories && (
        <section id="events-list">
          <div className="event-container" id="event-container">
            <div className="row">
              {repositories.map((event) => {
                return (
                  <div className="event-col">
                    <div className="event-card repo-card" key={event._id}>
                      <div className="event-header">
                        <FaBook className="icon" /> &nbsp;
                        <a
                          onClick={async () => {
                            await handleClick(event);
                          }}
                          href="#"
                          className="repo-anchor"
                        >
                          {event.name}
                        </a>
                        {event.is_codesource ? (
                          <span
                            style={{
                              marginLeft: '0.5rem',
                              fontSize: '0.8rem',
                              color: '#6a737d',
                              border: '1px solid #e1e4e8',
                              borderRadius: '6px',
                            }}
                          >
                            added
                          </span>
                        ) : (
                          <span
                            style={{
                              marginLeft: '0.5rem',
                              fontSize: '0.8rem',
                              color: '#6a737d',
                              border: '1px solid #e1e4e8',
                              borderRadius: '6px',
                            }}
                          >
                            Import
                          </span>
                        )}
                      </div>

                      <p className="repo-description">{event.description}</p>
                      <div>
                        {event.topics[0] && (
                          <>
                            <FaCircle style={{ color: randomColor() }} /> {event.topics[0]}{' '}
                            &nbsp;&nbsp;&nbsp;
                          </>
                        )}{' '}
                        &nbsp;&nbsp;&nbsp; <FaStar /> {event.stargazers_count} &nbsp;&nbsp;&nbsp;{' '}
                        <FaCodeBranch /> {event.forks}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pagination">
              {page > 1 && <button onClick={handlePrevPage}>Prev</button>}
              {repositories.length >= 10 && <button onClick={handleNextPage}>Next</button>}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default RepoList;
