import React, { useEffect } from 'react';
import EditablePage from '../textEditor/textEditorComponents/editablePage/EditablePage';

const TextEditor = ({ repo, selected }) => {
  useEffect(() => {}, [selected]);
  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Text Editor</h2>
      <EditablePage />
    </div>
  );
};

export default TextEditor;
