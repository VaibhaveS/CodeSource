import React, { useEffect, useState } from 'react';
import './DirectoryTree.css';

const DirectoryTree = ({ tree, selected, setSelected }) => {
  const [expanded, setExpanded] = useState({});
  const toggleExpanded = (directoryId) => {
    setExpanded({
      ...expanded,
      [directoryId]: !expanded[directoryId],
    });
  };
  const renderTree = (node) => {
    return (
      !expanded[node.directoryId] && (
        <ul>
          {node.files &&
            node.files.map((file) => (
              <li
                key={file.fileId}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelected(file.fileId);
                }}
              >
                {file.filename}
              </li>
            ))}
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
                      setSelected(value.directoryId);
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
      <h2 style={{ textAlign: 'center' }}>Collapsible Directory List</h2>
      <div className="box">
        <ul className="directory-list">{renderTree(tree)}</ul>
      </div>
    </div>
  );
};

export default DirectoryTree;
