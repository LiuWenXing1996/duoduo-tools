import { z } from "zod";
import { SystemConfigSchema } from "~/schema/system";
import { SystemService } from "~/server/service/system";
import { UserService } from "~/server/service/user";

export const paramsSchema = SystemConfigSchema;
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const userService = new UserService();
  await userService.requireCurrentSuper();
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });
  const systemService = new SystemService();
  const res = await systemService.updateConfig(data);
  return res;
});
