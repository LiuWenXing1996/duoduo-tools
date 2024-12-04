import { random, range } from "radash";
import { z } from "zod";
import { EmailService } from "~/server/service/email";
import { SystemService } from "~/server/service/system";
import prisma from "~/server/utils/prisma";
import { addMinutes } from "date-fns";

export const paramsSchema = z.object({
  email: z.string().min(1),
});
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });
  const systemService = new SystemService();
  const config = await systemService.requireConfig();
  const emailConfig = config.email;
  if (!emailConfig.enable) {
    throw createError({
      statusCode: 500,
      message: "系统没有配置邮箱服务",
    });
  }
  const code = Array.from(range(5))
    .map(() => {
      return random(0, 9);
    })
    .join("");
  await prisma.userEmailValidateCode.upsert({
    where: {
      email: data.email,
    },
    create: {
      email: data.email,
      code: code,
      expireDate: addMinutes(new Date(), 5).toISOString(),
    },
    update: {
      code: code,
      expireDate: addMinutes(new Date(), 5).toISOString(),
    },
  });
  const emailService = new EmailService();
  await emailService.send({
    config: emailConfig,
    data: {
      to: data.email,
      subject: "您的验证码",
      content: `您的验证码是 ${code} ，如非本人操作，请忽略`,
    },
  });
  return true;
});
