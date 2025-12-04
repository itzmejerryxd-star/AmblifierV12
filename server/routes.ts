import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAudioSettingsSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/audio-settings", async (req, res) => {
    try {
      const validatedData = insertAudioSettingsSchema.parse(req.body);
      const settings = await storage.saveAudioSettings(validatedData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ error: "Invalid audio settings" });
    }
  });

  app.get("/api/audio-settings/:id", async (req, res) => {
    const settings = await storage.getAudioSettings(req.params.id);
    if (!settings) {
      return res.status(404).json({ error: "Settings not found" });
    }
    res.json(settings);
  });

  app.patch("/api/audio-settings/:id", async (req, res) => {
    try {
      const settings = await storage.updateAudioSettings(req.params.id, req.body);
      if (!settings) {
        return res.status(404).json({ error: "Settings not found" });
      }
      res.json(settings);
    } catch (error) {
      res.status(400).json({ error: "Invalid audio settings update" });
    }
  });

  return httpServer;
}
