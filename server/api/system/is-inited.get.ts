import { z } from "zod";
import { SystemService } from "~/server/service/system";

export const paramsSchema = z.undefined();
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async () => {
  const systemService = new SystemService();
  const systemInited = await systemService.isInited();
  return systemInited;
});
