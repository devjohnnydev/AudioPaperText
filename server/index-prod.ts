import fs from "node:fs";
import { type Server } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express, { type Express, type Request } from "express";

import runApp from "./app";

export async function serveStatic(app: Express, server: Server) {
  // Health check endpoint for Railway
  app.get("/health", (_req, res) => {
    res.json({ status: "healthy" });
  });

  // Support both bundled and unbundled environments
  let distPath: string;
  const cwd = process.cwd();
  
  // Try multiple possible locations for the build directory
  const possiblePaths = [
    path.resolve(cwd, "dist", "public"),
    path.resolve(cwd, "public"),
    path.resolve(import.meta.dirname, "public"),
  ];
  
  for (const candidate of possiblePaths) {
    if (fs.existsSync(candidate)) {
      distPath = candidate;
      break;
    }
  }
  
  if (!distPath) {
    console.warn(
      `Build directory not found in: ${possiblePaths.join(", ")}. Continuing without static files.`
    );
    // Don't throw - let the app continue without static files
    distPath = possiblePaths[0];
  }

  console.log(`Serving static files from: ${distPath}`);
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
}

(async () => {
  await runApp(serveStatic);
})();
