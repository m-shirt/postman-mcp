import express from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { setupServerHandlers } from "./mcpServer.js";
import { discoverTools } from "./lib/tools.js";

const app = express();

// Keep express.json only if you need it for other routes,
// but DO NOT use it for /messages since MCP wants raw stream

// app.use(express.json());  <-- REMOVE this line or move below

const transports = {};
const servers = {};

const SERVER_NAME = "supercommerce";

app.get("/sse", async (req, res) => {
  const server = new Server(
    { name: SERVER_NAME, version: "0.1.0" },
    { capabilities: { tools: {} } }
  );
  server.onerror = (error) => console.error("[Error]", error);

  const tools = await discoverTools();
  await setupServerHandlers(server, tools);

  const transport = new SSEServerTransport("/messages", res);
  transports[transport.sessionId] = transport;
  servers[transport.sessionId] = server;

  res.on("close", async () => {
    delete transports[transport.sessionId];
    await server.close();
    delete servers[transport.sessionId];
    console.log(`SSE client disconnected: sessionId=${transport.sessionId}`);
  });

  await server.connect(transport);
});

// Here: DO NOT parse JSON body before MCP SDK reads raw stream
app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports[sessionId];
  const server = servers[sessionId];

  if (transport && server) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send("No transport/server found for sessionId");
  }
});

// Now you can safely use express.json for other routes if needed
// app.use(express.json());

const port = 3001;
app.listen(port, () => {
  console.log(`[SSE MCP Server] running:`);
  console.log(`  SSE stream:    http://localhost:${port}/sse`);
  console.log(`  Message input: http://localhost:${port}/messages?sessionId=YOUR_SESSION_ID`);
});
