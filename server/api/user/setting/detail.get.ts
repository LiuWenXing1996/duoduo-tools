import { z } from "zod";
import { UserService } from "~/server/service/user";
import {
  requireCurrentAdminUser,
  requireCurrentUser,
} from "~/server/utils/user";

export const paramsSchema = z.object({
  name: z.string().min(1),
});
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const user = await requireCurrentUser();
  const data = await getValidatedQuery(event, (data) => {
    return paramsSchema.parse(data);
  });
  if (user.name !== data.name) {
    await requireCurrentAdminUser();
  }
  const userService = new UserService();
  const setting = await userService.getSetting(user.id);
  return setting;
});
