import "dotenv/config";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";
import { app } from "./app";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const server = createServer(app);

async function start() {
  if (process.env.NODE_ENV === "production") {
    const dist = path.resolve(__dirname, "../dist");
    app.use(express.static(dist));
    app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
  } else {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  }

  const port = Number(process.env.PORT || 3000);
  server.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
