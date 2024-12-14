import { z } from "zod";
import { UserService } from "~/server/service/user";
import {
  requireCurrentAdminUser,
  requireCurrentUser,
} from "~/server/utils/user";

export const paramsSchema = z.object({
  name: z.string().min(1),
  config: z
    .object({
      sideBar: z.object({
        tools: z.record(z.boolean()),
      }),
    })
    .deepPartial(),
});
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const user = await requireCurrentUser();
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });
  if (user.name !== data.name) {
    await requireCurrentAdminUser();
  }
  const userService = new UserService();
  const setting = await userService.upsertSetting(user.id, {
    ...data.config,
  });
  return setting;
});
