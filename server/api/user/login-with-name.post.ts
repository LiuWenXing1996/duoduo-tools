import { z } from "zod";
import { UserService } from "~/server/service/user";

const paramsSchema = z.object({
  name: z.string().min(1),
  password: z.string().min(1),
});

export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });
  const userService = new UserService();
  return await userService.loginWithName(data);
});
