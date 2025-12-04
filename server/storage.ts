import { type User, type InsertUser, type AudioSettings, type InsertAudioSettings } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAudioSettings(id: string): Promise<AudioSettings | undefined>;
  saveAudioSettings(settings: InsertAudioSettings): Promise<AudioSettings>;
  updateAudioSettings(id: string, settings: Partial<InsertAudioSettings>): Promise<AudioSettings | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private audioSettings: Map<string, AudioSettings>;

  constructor() {
    this.users = new Map();
    this.audioSettings = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAudioSettings(id: string): Promise<AudioSettings | undefined> {
    return this.audioSettings.get(id);
  }

  async saveAudioSettings(settings: InsertAudioSettings): Promise<AudioSettings> {
    const id = randomUUID();
    const audioSettings: AudioSettings = { ...settings, id };
    this.audioSettings.set(id, audioSettings);
    return audioSettings;
  }

  async updateAudioSettings(id: string, settings: Partial<InsertAudioSettings>): Promise<AudioSettings | undefined> {
    const existing = this.audioSettings.get(id);
    if (!existing) return undefined;
    const updated: AudioSettings = { ...existing, ...settings };
    this.audioSettings.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
