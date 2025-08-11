// pages/api/mcp.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const remoteResponse = await axios({
      method: req.method,
      url: process.env.REMOTE_MCP_URL, // points to deployed MCP
      data: req.body,
      headers: { 'Content-Type': 'application/json' }
    });

    res.status(remoteResponse.status).json(remoteResponse.data);
  } catch (err) {
    console.error('Error calling MCP:', err.message);
    res.status(500).json({ error: 'Failed to reach MCP server' });
  }
}
