import React, { useState } from 'react';

export default function ChatUI() {
  const [input, setInput] = useState('');
  const [args, setArgs] = useState('{}'); // JSON args as string
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to pretty-print JSON
  const prettyJSON = (obj) => JSON.stringify(obj, null, 2);

  // Collapse toggle for blocks
  const CodeBlock = ({ title, children }) => {
    const [open, setOpen] = useState(false);
    return (
      <details style={{ marginTop: '8px' }} open={open}>
        <summary
          style={{ cursor: 'pointer', color: '#0070f3', fontWeight: 'bold' }}
          onClick={() => setOpen(!open)}
        >
          {title}
        </summary>
        <pre
          style={{
            background: '#f5f5f5',
            padding: '10px',
            borderRadius: '6px',
            maxHeight: '300px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {children}
        </pre>
      </details>
    );
  };

  // Handle user submitting tool call
  async function handleSubmit(e) {
    e.preventDefault();

    let parsedArgs;
    try {
      parsedArgs = JSON.parse(args || '{}');
    } catch {
      alert('Arguments must be valid JSON!');
      return;
    }

    if (!input.trim()) {
      alert('Please enter a tool name');
      return;
    }

    const toolName = input.trim();

    // Prepare request to /api/llm
    const requestPayload = {
      toolName,
      toolArguments: parsedArgs,
    };

    setLoading(true);

    // Add user input to chat
    setChatLog((prev) => [
      ...prev,
      {
        from: 'user',
        message: `Call tool: ${toolName}\nWith arguments:\n${prettyJSON(parsedArgs)}`,
      },
    ]);

    try {
      const res = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      const data = await res.json();

      setChatLog((prev) => [
        ...prev,
        {
          from: 'system',
          summaryMessage: data.summaryMessage || 'No summary returned.',
          mcpRequest: data.mcpRequest,
          mcpResponse: data.mcpResponse,
        },
      ]);
    } catch (err) {
      setChatLog((prev) => [
        ...prev,
        { from: 'system', summaryMessage: 'Error: ' + err.message },
      ]);
    } finally {
      setLoading(false);
      setInput('');
      setArgs('{}');
    }
  }

  return (
    <div
      style={{
        maxWidth: '700px',
        margin: '40px auto',
        padding: '20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgb(0 0 0 / 0.1)',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#0070f3' }}>
        MCP Server Chat Client
      </h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
          Tool Name:
        </label>
        <input
          type="text"
          value={input}
          placeholder="Enter MCP tool name (e.g. list_payment_methods)"
          onChange={(e) => setInput(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginBottom: '12px',
          }}
          disabled={loading}
          required
        />

        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
          Arguments (JSON):
        </label>
        <textarea
          rows={5}
          value={args}
          onChange={(e) => setArgs(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontFamily: 'monospace',
          }}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '12px',
            width: '100%',
            padding: '12px',
            backgroundColor: '#0070f3',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            transition: 'background-color 0.3s',
          }}
        >
          {loading ? 'Calling MCP Server...' : 'Call Tool'}
        </button>
      </form>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {chatLog.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: '18px',
              textAlign: msg.from === 'user' ? 'right' : 'left',
            }}
          >
            {msg.from === 'user' ? (
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: '#0070f3',
                  color: '#fff',
                  padding: '12px 18px',
                  borderRadius: '18px 18px 0 18px',
                  maxWidth: '80%',
                  whiteSpace: 'pre-wrap',
                  fontWeight: '600',
                }}
              >
                {msg.message}
              </div>
            ) : (
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: '#f1f1f1',
                  color: '#333',
                  padding: '14px 20px',
                  borderRadius: '18px 18px 18px 0',
                  maxWidth: '80%',
                }}
              >
                {/* Show friendly summary */}
                <div style={{ marginBottom: '10px', fontWeight: '600' }}>
                  {msg.summaryMessage}
                </div>

                {/* Show MCP request */}
                {msg.mcpRequest && (
                  <CodeBlock title="▼ MCP tools/call Request">
                    {prettyJSON(msg.mcpRequest)}
                  </CodeBlock>
                )}

                {/* Show MCP response */}
                {msg.mcpResponse && (
                  <CodeBlock title="▼ MCP tools/call Response">
                    {prettyJSON(msg.mcpResponse)}
                  </CodeBlock>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
