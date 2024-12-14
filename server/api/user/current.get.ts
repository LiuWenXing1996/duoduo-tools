import { z } from "zod";
import { getCurrentUser } from "~/server/utils/user";

const paramsSchema = z.undefined();
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const user = await getCurrentUser();
  return user;
});
