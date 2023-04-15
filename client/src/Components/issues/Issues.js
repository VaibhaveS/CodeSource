import React, { useState, useEffect } from 'react';
import { BrowserRouter as Routes, Route, Link } from 'react-router-dom';
import Issue from '../issue/Issue';
import './Issues.css';
import { GoIssueOpened } from 'react-icons/go';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const formattedDate = `${monthNames[monthIndex]} ${day}, ${year}`;
  return formattedDate;
};

const IssuesList = ({ reponame, username }) => {
  const [issues, setIssues] = useState(null);

  useEffect(() => {
    const getResponse = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/repo/${username}/${reponame}/issues`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );
      const repos = await response.json();
      console.log(repos);
      setIssues(repos);
    };
    getResponse();
  }, [reponame, username]);

  return (
    <>
      <button className="issue-button">
        <span style={{ color: 'white', fontWeight: 'bold' }}>Find an issue!</span>
      </button>
      <div class="issue-list">
        {issues &&
          issues.map((issue) => (
            <div className="issue-card">
              <div className="issue-header">
                <div className="issue-title">
                  <Link to={`${issue.details.id}`} className="issue-link">
                    <GoIssueOpened
                      size={'1.5rem'}
                      style={{ marginRight: '0.5rem' }}
                      color="#1a7f37"
                    />
                    {issue.details.title}
                  </Link>
                </div>
                <div className="issue-labels">
                  {issue.details.labels &&
                    issue.details.labels.map((label) => (
                      <span
                        key={label.id}
                        className="issue-label"
                        style={{ backgroundColor: `#${label.color}` }}
                      >
                        {label.name}
                      </span>
                    ))}
                </div>
              </div>
              <div className="issue-meta">
                <span className="issue-meta-item">
                  {issue.details.user && (
                    <>
                      Opened {formatDate(issue.details.created_at)} ago by{' '}
                      {issue.details.user.login}
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default IssuesList;
