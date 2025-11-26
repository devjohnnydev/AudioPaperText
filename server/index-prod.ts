import fs from "node:fs";
import { type Server } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express, { type Express, type Request } from "express";

import runApp from "./app";

export async function serveStatic(app: Express, server: Server) {
  // Support both bundled and unbundled environments
  let distPath: string;
  
  try {
    // Try using import.meta.url (works in some environments)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    distPath = path.resolve(__dirname, "public");
  } catch {
    // Fallback for Railway/production bundled environment
    distPath = path.resolve(process.cwd(), "dist", "public");
  }

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

(async () => {
  await runApp(serveStatic);
})();
