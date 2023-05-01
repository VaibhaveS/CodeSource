import React from 'react';
import './RepoNavbar.css';
import { Link } from 'react-router-dom';
import { FaBook, FaCode, FaCodeBranch, FaExclamationCircle, FaCompass } from 'react-icons/fa';

const RepoNavbar = ({ reponame, username }) => {
  return (
    <>
      <ul className="github">
        <li className="nav-li">
          <FaBook size={20} style={{ verticalAlign: 'middle' }} />
          <h3>
            <b>VaibhaveS/WhatTODO</b>
          </h3>
        </li>
        <li className="nav-li">
          <Link to={`/${username}/${reponame}/repository/code`}>
            <FaCode size={20} style={{ verticalAlign: 'middle' }} />
            Code
          </Link>
        </li>
        <li className="nav-li">
          <Link to={`/${username}/${reponame}/repository/pull-requests`}>
            <FaCodeBranch size={20} style={{ verticalAlign: 'middle' }} />
            Pull Requests
          </Link>
        </li>
        <li className="nav-li">
          <Link to={`/${username}/${reponame}/repository/issues`}>
            <FaExclamationCircle size={20} style={{ verticalAlign: 'middle' }} />
            Issues
          </Link>
        </li>
        <li className="nav-li">
          <Link to={`/${username}/${reponame}/repository/explore`}>
            <FaCompass size={20} style={{ verticalAlign: 'middle' }} />
            Explore
          </Link>
        </li>
      </ul>
    </>
  );
};

export default RepoNavbar;
