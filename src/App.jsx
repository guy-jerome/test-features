import React, { useState, useEffect } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const SharedEditor = () => {
  const [text, setText] = useState('');
  const ydoc = new Y.Doc(); // Shared Yjs document

  // Connect to the WebSocket server on component mount
  useEffect(() => {
    const ytext = ydoc.getText('shared-text'); // Get the text type
    const provider = new WebsocketProvider('ws://localhost:1234', 'my-room', ydoc); 

    // Sync initial Yjs state to the textarea
    setText(ytext.toString());

    // Handle changes from other users (receive updates)
    provider.awareness.on('update', (update) => {
      // Apply the received Yjs updates to the local text
      Y.applyUpdate(ydoc, update); 
    });

    // Handle local text changes and send to the server
    ytext.observe((event) => {
      if (event.origin !== 'local') { // Ignore events we triggered ourselves
        provider.awareness.setLocalState(null); // To signal changes
      } 
    });

    // Update React state when Yjs text changes
    ytext.observeDeep((event) => {
      setText(ytext.toString());
    });

    // Cleanup:
    return () => {
      provider.destroy();
    }
  }, []); 

  // Handle textarea change
  const handleChange = (event) => {
    setText(event.target.value);
    Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(ydoc));  // Send local change as update     
  };

  return (
    <textarea value={text} onChange={handleChange} />
  );
};

export default SharedEditor;