import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DirectoryTree from '../../Components/repositoryComponents/directoryTree/DirectoryTree';
import RepoNavbar from '../../Components/repositoryComponents/repoNavbar/RepoNavbar';
import Issues from '../../Components/issues/Issues';

import Issue from '../../Components/issue/Issue';
import TextEditor from '../../Components/repositoryComponents/textEditor/TextEditor';
import { useParams } from 'react-router-dom';

const Repository = () => {
  const { username, repositoryname } = useParams();
  const [repository, setRepository] = useState(null);
  const [selected, setSelected] = useState(null);

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
      {/* <Issue reponame={repositoryname} username={username} /> */}
      <Routes>
        <Route path="/issues/" element={<Issues reponame={repositoryname} username={username} />} />
        <Route
          path="/issues/:issueId"
          element={<Issue reponame={repositoryname} username={username} />}
        />
      </Routes>
    </div>
  );
};

export default Repository;
