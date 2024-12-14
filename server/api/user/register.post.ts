import { z } from "zod";
import { UserService } from "~/server/service/user";
import prisma from "~/server/utils/prisma";
import { useUserSession } from "~/server/utils/user";

const paramsSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  code: z.string().min(6),
});

export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });
  const userService = new UserService();
  const checkCodeRes = await userService.checkCode({
    email: data.email,
    code: data.code,
  });
  if (!checkCodeRes) {
    throw createError({
      statusCode: 400,
      message: "验证码错误",
    });
  }
  const user = await userService.create({
    name: data.name,
    email: data.email,
    password: data.password,
  });
  const useSession = await useUserSession();
  await useSession.clear();
  await useSession.update({
    id: user.id.toString(),
  });
  return true;
});
