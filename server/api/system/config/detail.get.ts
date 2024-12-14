import { z } from "zod";
import { SystemService } from "~/server/service/system";
import { UserService } from "~/server/service/user";

export const paramsSchema = z.undefined();
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async () => {
  const userService = new UserService();
  await userService.requireCurrentSuper();
  const systemService = new SystemService();
  const config = systemService.getConfig();
  return config;
});
