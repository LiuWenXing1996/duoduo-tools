import { assign } from "radash";
import { jsonParseSafely } from "~/utils";
import prisma from "../utils/prisma";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";
import { useUserSession } from "../utils/user";
import { isBefore } from "date-fns";

export interface UserSetting {
  sideBar?: {
    tools?: Record<string, boolean>;
  };
}

export class UserService {
  async encryptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
  async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
  async getCurrent() {
    const userSession = await useUserSession();
    const userId = userSession.data.id;
    if (userId) {
      return await this.getUser(Number(userId));
    }
  }
  async requireCurrent() {
    const user = await this.getCurrent();
    if (!user) {
      throw createError({
        statusCode: 401,
        message: "用户未登录",
      });
    }
    return user;
  }

  async requireCurrentAdmin() {
    const user = await this.requireCurrent();
    if (!(user.isAdmin || user.isSuper)) {
      throw createError({
        statusCode: 403,
        message: "用户不是管理员",
      });
    }
    return user;
  }

  async requireCurrentSuper() {
    const user = await this.requireCurrent();
    if (!user.isSuper) {
      throw createError({
        statusCode: 403,
        message: "用户不是超级管理员",
      });
    }
    return user;
  }

  pickUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSuper: user.isSuper,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  async loginWithEmail(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw createError({
        statusCode: 401,
        message: "用户不存在",
      });
    }
    const isEqual = await this.comparePassword(data.password, user.password);
    if (!isEqual) {
      throw createError({
        statusCode: 401,
        message: "密码错误",
      });
    }
    const useSession = await useUserSession();
    await useSession.clear();
    await useSession.update({
      id: user.id.toString(),
    });
    return true;
  }
  async loginWithName(data: { name: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: {
        name: data.name,
      },
    });
    if (!user) {
      throw createError({
        statusCode: 404,
        message: "用户不存在",
      });
    }
    const isEqual = await this.comparePassword(data.password, user.password);
    if (!isEqual) {
      throw createError({
        statusCode: 401,
        message: "密码错误",
      });
    }
    const useSession = await useUserSession();
    await useSession.clear();
    await useSession.update({
      id: user.id.toString(),
    });

    return true;
  }
  async create(data: {
    email: string;
    name: string;
    password: string;
    isSuper?: boolean;
    isAdmin?: boolean;
  }) {
    const userNameFound = await prisma.user.findUnique({
      where: {
        name: data.name,
      },
    });
    if (userNameFound) {
      throw createError({
        statusCode: 400,
        message: "用户名称已存在",
      });
    }
    const userEmailFound = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (userEmailFound) {
      throw createError({
        statusCode: 400,
        message: "用户邮箱已存在",
      });
    }
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        isSuper: data.isSuper,
        isAdmin: data.isAdmin,
        password: await this.encryptPassword(data.password),
      },
    });
    return this.pickUser(user);
  }
  async getUser(id: number) {
    if (!id) {
      return;
    }
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user ? this.pickUser(user) : user;
  }
  async getSetting(id: number) {
    const settingJson = (
      await prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          setting: true,
        },
      })
    )?.setting;
    const setting = jsonParseSafely<UserSetting>(settingJson);
    return setting;
  }
  async upsertSetting(id: number, data: Partial<UserSetting>) {
    const oldSetting = await this.getSetting(id);
    const newSetting = assign(oldSetting || {}, data || {});
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        setting: JSON.stringify(newSetting),
      },
    });
    const setting = jsonParseSafely<UserSetting>(user.setting);
    return setting;
  }
  async checkCode(params: { email: string; code: string }) {
    const { email, code } = params;
    const emailCodeRecord = await prisma.userEmailValidateCode.findFirst({
      where: {
        email: email,
      },
    });
    if (!code) {
      return false;
    }
    if (!emailCodeRecord) {
      return false;
    }

    if (!isBefore(new Date(), emailCodeRecord.expireDate)) {
      return false;
    }
    if (emailCodeRecord.code !== code) {
      return false;
    }
    return true;
  }
}
