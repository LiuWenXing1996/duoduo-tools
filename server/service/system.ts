import { jsonParseSafely } from "~/utils";
import prisma from "~/server/utils/prisma";
import { v4 as uuidV4 } from "uuid";
import CryptoJS from "crypto-js";
import { UserService } from "./user";
import type { EmailConfig } from "~/schema/email";

export interface SystemConfig {
  email: EmailConfig;
  userSession: {
    password: string;
  };
}

export class SystemService {
  userService = new UserService();
  async isInited() {
    const envInited = process.env.SYSTEM_INITED;
    if (envInited !== undefined) {
      console.log({ envInited });
      return Boolean(envInited);
    }
    const config = await this.getConfigString();
    return Boolean(config);
  }
  getSecretKey() {
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw createError({
        statusCode: 500,
        message: "系统配置出错，找不到密钥",
      });
    }
    return secretKey;
  }
  decrypt(value: string) {
    let res = "";
    const secretKey = this.getSecretKey();
    try {
      res = CryptoJS.AES.decrypt(value, secretKey).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: "解密系统配置失败",
      });
    }
    return res;
  }
  encrypt(value: string) {
    let res = "";
    const secretKey = this.getSecretKey();
    try {
      res = CryptoJS.AES.encrypt(value, secretKey).toString();
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: "加密系统配置失败",
      });
    }
    return res;
  }
  async init(data: { name: string; email: string; password: string }) {
    this.getSecretKey();
    const inited = await this.isInited();
    if (inited) {
      throw createError({
        statusCode: 400,
        message: "系统已初始化，无法重新初始化",
      });
    }
    const superUser = await this.userService.create({
      ...data,
      isSuper: true,
    });
    const defaultConfig = this.genDefaultConfig();
    await this.updateConfig(defaultConfig);

    return {
      superUser,
    };
  }
  genDefaultConfig(): SystemConfig {
    const config: SystemConfig = {
      email: {
        enable: false,
      },
      userSession: {
        password: uuidV4(),
      },
    };
    return config;
  }
  async getConfigString(): Promise<string | undefined> {
    const systemConfig = await prisma.systemConfig.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
    return systemConfig?.content;
  }
  async updateConfig(config: SystemConfig) {
    const configString = this.encrypt(JSON.stringify(config));
    await prisma.systemConfig.create({
      data: {
        content: configString,
      },
    });
    return config;
  }
  async getConfig() {
    const systemConfig = await prisma.systemConfig.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
    const configString = systemConfig?.content;
    if (configString) {
      const configDecrypt = this.decrypt(configString);
      return jsonParseSafely<SystemConfig>(configDecrypt);
    }
  }
  async requireConfig() {
    const config = await this.getConfig();
    if (!config) {
      throw createError({
        statusCode: 500,
        message: "系统出错，没有找到系统配置",
      });
    }
    return config;
  }
}
