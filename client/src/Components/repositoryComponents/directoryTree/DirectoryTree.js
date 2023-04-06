import React, { useEffect, useState } from 'react';
import './DirectoryTree.css';

const DirectoryTree = ({ tree }) => {
  const [expanded, setExpanded] = useState({});
  useEffect(() => {
    setExpanded({
      ...expanded,
      [0]: 1,
    });
  }, []);
  const toggleExpanded = (directoryId) => {
    console.log(directoryId);
    setExpanded({
      ...expanded,
      [directoryId]: !expanded[directoryId],
    });
  };
  const renderTree = (node) => {
    return (
      expanded[node.directoryId] && (
        <ul>
          {node.files && node.files.map((file) => <li key={file.fileId}>{file.filename}</li>)}
          {Object.entries(node)
            .filter(([key]) => key !== 'files')
            .map(
              ([key, value]) =>
                key !== 'directoryId' && (
                  <li
                    key={value.directoryId}
                    class="folder"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleExpanded(value.directoryId);
                    }}
                  >
                    {key}
                    {renderTree(value)}
                  </li>
                )
            )}
        </ul>
      )
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
