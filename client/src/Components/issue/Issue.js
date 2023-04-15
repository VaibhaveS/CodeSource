import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import Template from '../timeline/Timeline';
import { useParams } from 'react-router-dom';

import './Issue.css';
import { useState, useEffect } from 'react';

function parseText(text) {
  const lines = text.split('\n');
  let result = '';

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (line.includes('![image]')) {
      line = line.replace(/!\[image\]\((.*?)\)/g, '');
    }
    if (line.startsWith('- ')) {
      result += '<span class="issue-text"><li>' + line.substring(2).trim() + '</l><span>';
    } else {
      result += '<span class="issue-text">' + line + '</span>';
    }
  }
  return result;
}

const IssuePage = ({ username }) => {
  const [issuez, setIssuez] = useState(null);
  const { issueId } = useParams();

  const [dueDate, setDueDate] = useState(new Date());
  const [inProgress, setInProgress] = useState(false);
  const [booked, setBooked] = useState(null);

  const handleDueDateChange = async (e) => {
    setDueDate(new Date(e.target.value));
    const updateIssue = async () => {
      await fetch(
        `${process.env.REACT_APP_SERVER_URL}/repo/issues/update/${issueId}/${new Date(
          e.target.value
        )}/${inProgress}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );
    };

    // Call the updateIssue function whenever dueDate or inProgress state changes
    updateIssue();
  };

  const handleAssigneeChange = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/repo/issues/${issueId}/${username}/book`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }
    );
    const responseData = await response.json();
    issuez.bookedBy = responseData;
    setIssuez(issuez);
    setBooked(responseData);
    console.log('new issue', issuez);
  };

  useEffect(() => {
    const getResponse = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/repo/find/issue/${issueId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );
      const repos = await response.json();
      setIssuez(repos);
      if (repos.due) setDueDate(repos.due);
      console.log('i got this from backend', repos.progress);
      if (repos.progress) setInProgress(repos.progress);
    };
    getResponse();
  }, [issueId, booked, dueDate]);

  return (
    <>
      {issuez && (
        <>
          <div className="issue-page-main">
            <div className="issue-header-main">
              <h1 className="issue-title-main">
                <FaExclamationCircle className="issue-icon-main" />
                &nbsp;&nbsp;
                <a href={issuez.html_url} style={{ textDecoration: 'none' }}>
                  {issuez.details.title}
                </a>
                <button
                  className="issue-button"
                  onClick={handleAssigneeChange}
                  disabled={issuez.bookedBy}
                >
                  Request to contribute
                </button>
                {issuez.details.user.login === username && (
                  <>
                    <span>Due date </span>
                    <input
                      type="date"
                      class="input-issue"
                      onChange={(event) => {
                        handleDueDateChange(event);
                      }}
                    />
                  </>
                )}
              </h1>

              <div className="issue-meta-main">
                <span className="issue-meta-item-main">
                  #{issuez.details.number} opened on{' '}
                  {new Date(issuez.details.created_at).toLocaleDateString()} by{' '}
                  {issuez.details.user.login}
                </span>
              </div>
              <div
                className="issue-body-main"
                dangerouslySetInnerHTML={{ __html: parseText(issuez.details.body) }}
              />
            </div>
            <Template issue={issuez} dueDate={dueDate} />
          </div>
        </>
      )}
    </>
  );
};

export default IssuePage;
