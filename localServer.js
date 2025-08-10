// localTest.js
import express from "express";
import handler from "./api/mcp.js"; // Your Vercel API handler

const app = express();
app.use(express.json());

app.post("/api/mcp", (req, res) => {
  handler(req, res);
});

app.listen(3001, () => {
  console.log("Local MCP API running at http://localhost:3001/api/mcp");
});
