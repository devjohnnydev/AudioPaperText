import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { transcribeAudio, extractTextFromImage, generateIntelligentReport } from "./ai-service";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Ensure uploads directory exists
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }

  /**
   * POST /api/transcribe-audio
   * Upload and transcribe audio file
   */
  app.post("/api/transcribe-audio", upload.single("audio"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }

      const filePath = req.file.path;
      const fileName = req.file.originalname;

      // Transcribe using Groq Whisper
      const transcription = await transcribeAudio(filePath);

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      res.json({
        success: true,
        fileName,
        transcription,
      });
    } catch (error: any) {
      console.error("Erro na transcrição:", error);
      res.status(500).json({
        error: "Erro ao transcrever áudio",
        details: error.message,
      });
    }
  });

  /**
   * POST /api/extract-text
   * Upload and extract text from image (OCR)
   */
  app.post("/api/extract-text", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhuma imagem enviada" });
      }

      const filePath = req.file.path;
      const fileName = req.file.originalname;

      // Convert to base64
      const imageBuffer = fs.readFileSync(filePath);
      const base64Image = imageBuffer.toString("base64");

      // Extract text using Groq Vision
      const extractedText = await extractTextFromImage(base64Image);

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      res.json({
        success: true,
        fileName,
        extractedText,
      });
    } catch (error: any) {
      console.error("Erro no OCR:", error);
      res.status(500).json({
        error: "Erro ao extrair texto",
        details: error.message,
      });
    }
  });

  /**
   * POST /api/generate-report
   * Generate intelligent report from audio and OCR results
   */
  app.post("/api/generate-report", async (req, res) => {
    try {
      const { audioItems = [], ocrItems = [] } = req.body;

      if (audioItems.length === 0 && ocrItems.length === 0) {
        return res.status(400).json({
          error: "Nenhum conteúdo fornecido para gerar relatório",
        });
      }

      // Generate report using AI
      const report = await generateIntelligentReport(audioItems, ocrItems);

      res.json({
        success: true,
        report,
      });
    } catch (error: any) {
      console.error("Erro ao gerar relatório:", error);
      res.status(500).json({
        error: "Erro ao gerar relatório",
        details: error.message,
      });
    }
  });

  /**
   * POST /api/projects
   * Save a project
   */
  app.post("/api/projects", async (req, res) => {
    try {
      const project = await storage.createProject(req.body);
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/projects/:id
   * Get a project by ID
   */
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ error: "Projeto não encontrado" });
      }
      
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}