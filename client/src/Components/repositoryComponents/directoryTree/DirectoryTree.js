import React from 'react';
import './DirectoryTree.css';

const DirectoryTree = ({ tree }) => {
  const renderTree = (node) => {
    return (
      <ul>
        {node.files && node.files.map((file) => <li key={file.fileId}>{file.filename}</li>)}
        {Object.entries(node)
          .filter(([key]) => key !== 'files')
          .map(
            ([key, value]) =>
              key !== 'directoryId' && (
                <li key={value.directoryId}>
                  {key}
                  {renderTree(value)}
                </li>
              )
          )}
      </ul>
    );
  };

  return (
    <div>
      <h2>Collapsible Directory List</h2>
      <div className="box">
        <ul className="directory-list">{renderTree(tree)}</ul>
      </div>
    </div>
  );
};

export default DirectoryTree;
