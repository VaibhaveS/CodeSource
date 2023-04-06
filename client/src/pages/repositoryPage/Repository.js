import React from 'react';
import DirectoryTree from '../../Components/repositoryComponents/directoryTree/DirectoryTree';
import RepoNavbar from '../../Components/repositoryComponents/repoNavbar/RepoNavbar';
import TextEditor from '../../Components/repositoryComponents/textEditor/TextEditor';

const Repository = () => {
  return (
    <div>
      <h1>This is the Repo page</h1>
      <RepoNavbar />
      <div>
        <TextEditor />
        <DirectoryTree />
      </div>
    </div>
  );
};

export default Repository;
