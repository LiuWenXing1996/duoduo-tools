import { z } from "zod";

export const EmailSendOptionsSchema = z.object({
  config: z.object({
    host: z.string().min(1),
    port: z.string().min(1),
    authUser: z.string().min(1),
    authPass: z.string().min(1),
  }),
  data: z.object({
    to: z.string().min(1),
    subject: z.string().min(1),
    content: z.string().min(1),
  }),
});
export type EmailSendOptions = z.infer<typeof EmailSendOptionsSchema>;

export const EmailConfigSchema = z.union([
  z.object({
    enable: z.literal(false),
  }),
  z
    .object({
      enable: z.literal(true),
    })
    .and(EmailSendOptionsSchema.shape.config),
]);
export type EmailConfig = z.infer<typeof EmailConfigSchema>;

export const EmailTestSendOptionsSchema = z.object({
  data: EmailSendOptionsSchema.shape.data,
  config: EmailSendOptionsSchema.shape.config.omit({ authPass: true }).and(
    z.union([
      z.object({
        isChangeAuthPass: z.literal(false),
      }),
      z.object({
        isChangeAuthPass: z.literal(true),
        authPass: z.string().min(1),
      }),
    ])
  ),
});
export type EmailTestSendOptions = z.infer<typeof EmailTestSendOptionsSchema>;
