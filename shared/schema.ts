import { z } from "zod";

export const audioDeviceSchema = z.object({
  deviceId: z.string(),
  label: z.string(),
  kind: z.enum(["audioinput", "audiooutput"]),
  isDefault: z.boolean().optional(),
});

export const audioSettingsSchema = z.object({
  id: z.string().optional(),
  inputDeviceId: z.string(),
  outputDeviceId: z.string(),
  boostLevel: z.number().min(0).max(1000),
  isBoostEnabled: z.boolean(),
  isMuted: z.boolean(),
});

export const insertAudioSettingsSchema = audioSettingsSchema.omit({ id: true });

export type AudioDevice = z.infer<typeof audioDeviceSchema>;
export type AudioSettings = z.infer<typeof audioSettingsSchema>;
export type InsertAudioSettings = z.infer<typeof insertAudioSettingsSchema>;

export const users = {
  id: "",
  username: "",
  password: "",
};

export type InsertUser = {
  username: string;
  password: string;
};

export type User = {
  id: string;
  username: string;
  password: string;
};
