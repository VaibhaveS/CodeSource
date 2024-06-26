import React, { useEffect, useState } from 'react';
import RepoNavbar from '../../Components/repositoryComponents/repoNavbar/RepoNavbar';
import Code from '../../Components/repositoryComponents/code/Code';
import { useParams } from 'react-router-dom';
import Issue from '../../Components/repositoryComponents/issues/Issue';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Repository = () => {
  const { username, repositoryname } = useParams();
  const [repository, setRepository] = useState(null);

  useEffect(() => {
    const getResponse = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/repo/${username}/${repositoryname}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );
      const repo = await response.json();
      setRepository(repo);
    };
    getResponse();
  }, [username, repositoryname]);
  return (
    <div>
      <RepoNavbar reponame={repositoryname} username={username} />
      <Routes>
        <Route
          path="/code"
          element={
            <Code repositoryname={repositoryname} username={username} repository={repository} />
          }
        />
        <Route
          path="/"
          element={
            <Code repositoryname={repositoryname} username={username} repository={repository} />
          }
        />
        <Route
          path="/issues"
          element={<Issue reponame={repositoryname} username={username} repository={repository} />}
        />
      </Routes>
    </div>
  );
};

export default Repository;
