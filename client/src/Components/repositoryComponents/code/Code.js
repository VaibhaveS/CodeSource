import React, { useState } from 'react';
import DirectoryTree from '../directoryTree/DirectoryTree';
import TextEditor from '../textEditor/TextEditor';
import ChatWindow from '../../socket/ChatWindow';

const Code = ({ repositoryname, username, repository }) => {
  const [selected, setSelected] = useState(null);
  return (
    <div>
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
      <ChatWindow selected={selected || 1} user={username} reponame={repositoryname} />
    </div>
  );
};

export default Code;
