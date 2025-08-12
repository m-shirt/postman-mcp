// /pages/api/sse.js
import { transports, servers } from './_globals.js';
import { discoverTools } from '../../lib/tools.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { setupServerHandlers } from '../../mcpServer.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

function sendHeartbeat(res) {
  if (!res.writableEnded) {
    res.write(':\n\n'); // SSE comment heartbeat
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  try {
    const tools = await discoverTools();

    const server = new Server(
      { name: 'supercommerce', version: '0.1.0' },
      { capabilities: { tools: {} } }
    );
    server.onerror = (error) => console.error('[SSE Server Error]', error);

    await setupServerHandlers(server, tools);

    const transport = new SSEServerTransport('/api/messages', res);
    transports[transport.sessionId] = transport;
    servers[transport.sessionId] = server;

    console.log('SSE connection established. SessionId:', transport.sessionId);

    const heartbeatInterval = setInterval(() => sendHeartbeat(res), 15000);

    req.on('close', async () => {
      clearInterval(heartbeatInterval);
      delete transports[transport.sessionId];
      await server.close();
      delete servers[transport.sessionId];
      console.log('SSE client disconnected:', transport.sessionId);
    });

    server.connect(transport).catch((err) => {
      console.error('SSE Server connection error:', err);
    });
  } catch (err) {
    console.error('[SSE Handler Error]', err);
    if (!res.headersSent) {
      res.status(500).end('Internal Server Error');
    }
  }
}
