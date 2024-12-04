import { z } from "zod";
import { SystemService } from "~/server/service/system";
import { useUserSession } from "~/server/utils/user";

const paramsSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
});

export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const systemService = new SystemService();
  const systemInited = await systemService.isInited();
  if (systemInited) {
    throw createError({
      statusCode: 400,
      message: "系统已初始化，无法重新初始化",
    });
  }
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });

  const res = await systemService.init({
    name: data.name,
    email: data.email,
    password: data.password,
  });

  const user = res.superUser;

  const useSession = await useUserSession();
  await useSession.clear();
  await useSession.update({
    id: user.id.toString(),
  });

  return true;
});