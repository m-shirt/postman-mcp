import { discoverTools } from "../lib/tools.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { setupServerHandlers } from "../mcpServer.js"; // if you export it

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const accept = (req.headers["accept"] || "").toLowerCase();
  if (!accept.includes("application/json") || !accept.includes("text/event-stream")) {
    return res.status(406).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Not Acceptable: Client must accept both application/json and text/event-stream" },
      id: null
    });
  }

  const tools = await discoverTools();
    console.log(JSON.stringify(tools, null, 2));

  const server = new Server({ name: "supercommerce", version: "0.1.0" }, { capabilities: { tools: {} } });
  await setupServerHandlers(server, tools);

  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", async () => {
    await transport.close();
    await server.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
}
