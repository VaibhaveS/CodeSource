import './Issue.scss';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Routes, Route, Link } from 'react-router-dom';
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

const Issues = ({ reponame, username }) => {
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

  console.log(issues);
  return (
    <>
      <div class="projects-section">
        <div class="projects-section-header">
          <div class="header-left">
            <div class="projects-status">
              <div class="item-status">
                <span class="status-number">45</span>
                <span class="status-type">Un Assigned</span>
              </div>
              <div class="item-status">
                <span class="status-number">24</span>
                <span class="status-type">In Progress</span>
              </div>
              <div class="item-status">
                <span class="status-number">62</span>
                <span class="status-type">Overdue</span>
              </div>
            </div>
          </div>
        </div>
        <div class="issue-list">
          {issues &&
            issues.map((issue) => (
              <div className="issue-card">
                <div className="issue-header">
                  <div className="issue-title">
                    <Link to={`${issue.details.id}`} className="issue-link">
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
                <div class="project-box-footer">
                  {issue.details.assignees.length > 0 ? (
                    <div class="participants">
                      Devs &nbsp;
                      {issue.details.assignees.map((assignee) => (
                        <img src={assignee.avatar_url} alt="participant" />
                      ))}
                    </div>
                  ) : (
                    <h3>Unassigned</h3>
                  )}
                  <div class="days-left" style={{ color: '#ff942e' }}>
                    2 Days Left
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Issues;
