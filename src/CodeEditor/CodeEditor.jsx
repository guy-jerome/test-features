import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const iframeRef = useRef(null);

  function handleEditorChange(value, event) {
    setCode(value);
  }
  function executeCode() {
    // Clear previous output
    setOutput('');

    // Create a new iframe to execute the code
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframeRef.current = iframe;

    // Create a sandboxed environment inside the iframe
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(`
      <html>
        <body>
          <script>
            try {
              // Create a function from the user's code
              const userCode = ${JSON.stringify(code)};
              const userFunction = new Function('console', userCode);
              // Capture console.log output
              let capturedConsoleOutput = '';
              const originalConsoleLog = console.log;
              console.log = (...args) => {
                capturedConsoleOutput += args.join(' ') + '\\n';
              };
              // Execute the user's code
              userFunction(console);
              // Restore console.log
              console.log = originalConsoleLog;
              // Send the output back to the main page
              parent.postMessage({ output: capturedConsoleOutput }, '*');
            } catch (error) {
              parent.postMessage({ error: error.message }, '*');
            }
          </script>
        </body>
      </html>
    `);
    iframeDocument.close();

    // Listen for messages from the iframe
    window.addEventListener('message', handleMessage);
  }

  function handleMessage(event) {
    // Handle messages from the iframe
    const { data } = event;
    if (data.output !== undefined) {
      setOutput(data.output);
    } else if (data.error !== undefined) {
      setOutput(`Error: ${data.error}`);
    }
    // Clean up the iframe
    if (iframeRef.current) {
      iframeRef.current.parentNode.removeChild(iframeRef.current);
      iframeRef.current = null;
    }
    window.removeEventListener('message', handleMessage);
  }

  return (
    <div>
      <Editor
        defaultLanguage="javascript"
        theme="vs-dark"
        defaultValue="// Enter your code here"
        onChange={handleEditorChange}
      />
      <button onClick={executeCode}>
        Execute Code
      </button>
      <textarea
        value={output}
        readOnly
      />
    </div>
  );
}
