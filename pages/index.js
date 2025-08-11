import { useState, useEffect } from 'react';

function CollapsibleCodeBlock({ title, code }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 12 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer', fontWeight: 'bold' }}
      >
        {open ? '▼' : '▶'} {title}
      </button>
      {open && (
        <pre
          style={{
            background: '#f4f4f4',
            padding: 12,
            borderRadius: 6,
            maxHeight: 200,
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            fontSize: 12,
          }}
        >
          {code}
        </pre>
      )}
    </div>
  );
}

export default function Home() {
  const [chat, setChat] = useState([
    {
      role: 'system',
      content: 'Fetching MCP tools...',
    },
  ]);
  const [input, setInput] = useState('');
  const [toolsListData, setToolsListData] = useState(null);
  const [loading, setLoading] = useState(false);

  // On load, fetch tools list
  useEffect(() => {
    async function fetchToolsList() {
      setLoading(true);
      const res = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'list tools' }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.error) {
        setChat([{ role: 'system', content: `Error fetching tools: ${data.error}` }]);
        return;
      }

      setToolsListData(data);

      // Add system message with summary + collapsibles for tools/list request and response
      setChat([
        {
          role: 'system',
          content: (
            <>
              <div>
                MCP server offers {data.toolsList.length} tool(s):{' '}
                {data.toolsList.join(', ')}
              </div>
              <CollapsibleCodeBlock title="MCP tools/list Request" code={data.toolsListRaw} />
              <CollapsibleCodeBlock title="MCP tools/list Response" code={data.toolsListResponse} />
              <div style={{ marginTop: 10, fontWeight: 'bold' }}>
                You can now type the tool name to call it.
              </div>
            </>
          ),
        },
      ]);
    }
    fetchToolsList();
  }, []);

  // Handle user submitting a tool name to call
  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || !toolsListData) return;

    // Append user message
    setChat((c) => [...c, { role: 'user', content: input.trim() }]);

    setLoading(true);

    // Call MCP tool via API
    const res = await fetch('/api/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input.trim() }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      setChat((c) => [
        ...c,
        { role: 'assistant', content: `Error calling tool: ${data.error}` },
      ]);
      return;
    }

    setChat((c) => [
      ...c,
      {
        role: 'assistant',
        content: (
          <>
            <div>
              <b>Called Tool:</b> {data.chosenTool}
            </div>
            <CollapsibleCodeBlock title="MCP tools/call Request" code={data.toolsCallRequestRaw} />
            <CollapsibleCodeBlock title="MCP tools/call Response" code={data.toolsCallResponseRaw} />
            <div style={{ marginTop: 10 }}>{data.summaryMessage}</div>
          </>
        ),
      },
    ]);

    setInput('');
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '40px auto',
        fontFamily: 'Arial, sans-serif',
        padding: '0 20px',
      }}
    >
      <h2>MCP Chat UI</h2>

      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: 20,
          minHeight: 300,
          maxHeight: 600,
          overflowY: 'auto',
          marginBottom: 20,
          backgroundColor: '#fafafa',
        }}
      >
        {chat.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              whiteSpace: 'pre-wrap',
              background: msg.role === 'user' ? '#e0f7fa' : '#fff',
              padding: 10,
              borderRadius: 6,
              border: msg.role === 'user' ? '1px solid #26c6da' : '1px solid #ccc',
            }}
          >
            {typeof msg.content === 'string' ? msg.content : msg.content}
          </div>
        ))}

        {loading && <div style={{ fontStyle: 'italic' }}>Loading...</div>}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Type tool name to call"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flexGrow: 1, padding: 10, fontSize: 16 }}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} style={{ padding: '10px 16px' }}>
          Send
        </button>
      </form>
    </div>
  );
}
