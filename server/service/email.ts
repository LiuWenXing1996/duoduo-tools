import nodemailer from "nodemailer";
import { EmailSendOptionsSchema, type EmailSendOptions } from "~/schema/email";

export class EmailService {
  async send(params: EmailSendOptions) {
    EmailSendOptionsSchema.parse(params);
    const transporter = nodemailer.createTransport({
      host: params.config.host,
      port: Number(params.config.port),
      secure: true,
      auth: {
        pass: params.config.authPass,
        user: params.config.authUser,
      },
    });
    const resolveErrorMessage = (e: any) => {
      if (!e) {
        return `未知错误`;
      }
      const code = e?.responseCode || e?.code;
      const content = e?.response;
      return `${code ? `(${code}) ` : ``}${content}`;
    };
    try {
      const info = await transporter.sendMail({
        from: params.config.authUser,
        to: params.data.to,
        subject: params.data.subject,
        html: params.data.content,
      });
      return info;
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        message: `发送失败: ${resolveErrorMessage(error)}`,
      });
    }
  }
}
