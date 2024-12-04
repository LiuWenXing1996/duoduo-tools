import { z } from "zod";
import { EmailService } from "~/server/service/email";
import { UserService } from "~/server/service/user";
import { EmailSendOptionsSchema } from "~/schema/email";

export const paramsSchema = EmailSendOptionsSchema;
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const userService = new UserService();
  await userService.requireCurrentSuper();
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });
  const emailService = new EmailService();
  await emailService.send(data);
  return true;
});
