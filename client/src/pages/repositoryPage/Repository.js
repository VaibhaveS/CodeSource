import React, { useEffect, useState } from 'react';
import DirectoryTree from '../../Components/repositoryComponents/directoryTree/DirectoryTree';
import RepoNavbar from '../../Components/repositoryComponents/repoNavbar/RepoNavbar';
import TextEditor from '../../Components/repositoryComponents/textEditor/TextEditor';
import { useParams } from 'react-router-dom';

const Repository = () => {
  const { username, repositoryname } = useParams();
  const [repository, setRepository] = useState(null);

  useEffect(() => {
    const getResponse = async () => {
      const response = await fetch(`http://localhost:3000/repo/${username}/${repositoryname}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const repo = await response.json();
      setRepository(repo);
    };
    getResponse();
  }, [username, repositoryname]);
  return (
    <div>
      <h1>
        This is the Repo page {username}/{repositoryname}
      </h1>
      <RepoNavbar />
      <div>
        <TextEditor />
        {repository && <DirectoryTree tree={repository.details.dirTree} />}
      </div>
    </div>
  );
};

export default Repository;
