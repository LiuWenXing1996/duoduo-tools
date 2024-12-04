import { z } from "zod";
import { EmailConfigSchema } from "./email";
export const SystemConfigSchema = z.object({
  email: z.object({}).and(EmailConfigSchema),
  userSession: z.object({
    password: z.string().min(32),
  }),
});

export type SystemConfig = z.infer<typeof SystemConfigSchema>;
