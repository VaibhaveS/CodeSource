import React, { useEffect, useState } from 'react';
import DirectoryTree from '../../Components/repositoryComponents/directoryTree/DirectoryTree';
import RepoNavbar from '../../Components/repositoryComponents/repoNavbar/RepoNavbar';
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
      <h1>
        This is the Repo page {username}/{repositoryname}
      </h1>
      <RepoNavbar />
      <div style={{ display: 'flex' }}>
        {repository && (
          <>
            <div style={{ flex: 1 }}>
              <TextEditor repo={repository} selected={selected} />
            </div>
            <div style={{ flex: 1 }}>
              <DirectoryTree
                tree={repository.details.dirTree}
                selected={selected}
                setSelected={setSelected}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Repository;
