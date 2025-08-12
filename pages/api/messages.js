// /pages/api/messages.js
import { transports, servers } from './_globals.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const sessionId = req.query.sessionId;
  if (!sessionId) {
    res.status(400).send('Missing sessionId query parameter');
    return;
  }

  console.log('Incoming /api/messages POST, sessionId:', sessionId);
  console.log('Active sessions:', Object.keys(transports));

  const transport = transports[sessionId];
  const server = servers[sessionId];

  if (!transport || !server) {
    res.status(400).send('No transport/server found for sessionId');
    return;
  }

  try {
    await transport.handlePostMessage(req, res);
  } catch (err) {
    console.error('Error handling POST message:', err);
    if (!res.headersSent) {
      res.status(500).end('Internal Server Error');
    }
  }
}
