import React, { useEffect, useState } from 'react';
import { FaStar, FaCodeBranch, FaCircle, FaBook } from 'react-icons/fa';
import './RepoList.css';

const RepoList = () => {
  const [repositories, setRepositories] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const getResponse = async () => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/repo/repos?page=${page}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const repos = await response.json();
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

  return (
    <div>
      {repositories && (
        <section id="events-list">
          <div className="event-container" id="event-container">
            <div className="row">
              {repositories.map((event) => {
                if (event != null)
                  //TODO: check repositories[0] == null
                  return (
                    <div className="event-col">
                      <div className="event-card repo-card" key={event._id}>
                        <div className="event-header">
                          <FaBook className="icon" /> &nbsp;
                          <a
                            href={`${process.env.REACT_APP_CLIENT_URL}/${event.owner.login}/${event.name}/repository`}
                            className="repo-anchor"
                          >
                            {event.full_name}
                          </a>
                        </div>

                        <p className="repo-description">{event.description}</p>
                        <div>
                          {event.topics && (
                            <>
                              <FaCircle style={{ color: randomColor() }} /> {event.topics[0]}{' '}
                              &nbsp;&nbsp;&nbsp;
                            </>
                          )}{' '}
                          <FaStar /> {event.stargazers_count} &nbsp;&nbsp;&nbsp; <FaCodeBranch />{' '}
                          {event.forks}
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
