import fetch from 'node-fetch';

// Levenshtein distance function for fuzzy matching
function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, () =>
    Array(a.length + 1).fill(0)
  );
  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : 1 + Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]);
    }
  }
  return matrix[b.length][a.length];
}

function findClosestTool(tools, input) {
  let closest = null;
  let minDist = Infinity;
  for (const t of tools) {
    const dist = levenshtein(t.name.toLowerCase(), input.toLowerCase());
    if (dist < minDist) {
      minDist = dist;
      closest = t;
    }
  }
  return closest;
}

const MCP_URL = process.env.MCP_SERVER_URL || 'http://localhost:3001/mcp';

function jsonRpcRequest(method, params = {}, id = '1') {
  return {
    jsonrpc: '2.0',
    id,
    method,
    params,
  };
}

function summarizeToolResult(result) {
  if (!result?.content || !Array.isArray(result.content)) {
    return 'No content returned from tool.';
  }
  try {
    const jsonText = result.content[0]?.text || '';
    const parsed = JSON.parse(jsonText);

    if (parsed.code && parsed.message && parsed.data) {
      const itemsCount = Array.isArray(parsed.data) ? parsed.data.length : 'unknown number of';
      return `Result: Code ${parsed.code} (${parsed.message}), contains ${itemsCount} item(s).`;
    }
    return 'Tool call returned data but summary not implemented for this format.';
  } catch {
    return `Result text: ${result.content[0]?.text?.slice(0, 300) || '[empty]'}`;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const toolsListReq = jsonRpcRequest('tools/list');
    const toolsListResponse = await fetch(MCP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
      body: JSON.stringify(toolsListReq),
    });

    const toolsListText = await toolsListResponse.text();

    let toolsListJson = null;
    try {
      if (toolsListText.startsWith('event:')) {
        const lines = toolsListText.split('\n');
        const dataLine = lines.find((line) => line.startsWith('data:'));
        if (dataLine) {
          toolsListJson = JSON.parse(dataLine.replace(/^data:\s*/, ''));
        }
      } else {
        toolsListJson = JSON.parse(toolsListText);
      }
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse MCP tools/list response' });
    }

    if (!toolsListJson?.result?.tools || toolsListJson.result.tools.length === 0) {
      return res.status(500).json({ error: 'No tools available from MCP server.' });
    }

    if (prompt.trim().toLowerCase() === 'list tools') {
      const toolsListRaw = JSON.stringify(toolsListReq, null, 2);
      const summaryMessage = `MCP server offers ${toolsListJson.result.tools.length} tool(s): ${toolsListJson.result.tools
        .map((t) => t.name)
        .join(', ')}`;
      return res.status(200).json({
        toolsList: toolsListJson.result.tools.map((t) => t.name),
        toolsListRaw,
        toolsListResponse: toolsListText,
        summaryMessage,
      });
    }

    const closestTool = findClosestTool(toolsListJson.result.tools, prompt.trim());
    if (!closestTool) {
      return res.status(400).json({ error: 'No matching tool found.' });
    }

    const args = {};
    if (closestTool.inputSchema?.properties) {
      for (const [key, prop] of Object.entries(closestTool.inputSchema.properties)) {
        if (prop.default !== undefined) args[key] = prop.default;
        else if (prop.type === 'string') args[key] = '';
        else if (prop.type === 'number' || prop.type === 'integer') args[key] = 0;
        else if (prop.type === 'boolean') args[key] = false;
        else args[key] = null;
      }
    }

    const toolsCallReq = jsonRpcRequest('tools/call', {
      name: closestTool.name,
      arguments: args,
    });

    const toolsCallResponse = await fetch(MCP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
      body: JSON.stringify(toolsCallReq),
    });

    const toolsCallResponseText = await toolsCallResponse.text();

    let toolsCallJson = null;
    try {
      if (toolsCallResponseText.startsWith('event:')) {
        const lines = toolsCallResponseText.split('\n');
        const dataLine = lines.find((line) => line.startsWith('data:'));
        if (dataLine) {
          toolsCallJson = JSON.parse(dataLine.replace(/^data:\s*/, ''));
        }
      } else {
        toolsCallJson = JSON.parse(toolsCallResponseText);
      }
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse MCP tools/call response' });
    }

    if (toolsCallJson.error) {
      return res.status(400).json({ error: toolsCallJson.error.message || 'Error from MCP' });
    }

    const summaryMessage = summarizeToolResult(toolsCallJson.result);

    return res.status(200).json({
      chosenTool: closestTool.name,
      toolsCallRequestRaw: JSON.stringify(toolsCallReq, null, 2),
      toolsCallResponseRaw: toolsCallResponseText,
      summaryMessage,
      matchedToolName: closestTool.name,
      inputArguments: args,
      parsedResult: toolsCallJson.result,
    });
  } catch (error) {
    console.error('Error in /api/llm:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
