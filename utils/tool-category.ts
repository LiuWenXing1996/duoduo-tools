export enum ToolCategory {
  dev = "dev",
  text = "text",
  picture = "picture",
  encryption = "encryption",
  admin = "admin",
}

export interface ToolCategoryMeta {
  icon: string;
  title: string;
  auth?: ToolMetaAuth;
}

export const ToolCategoryMap: Record<ToolCategory, ToolCategoryMeta> = {
  [ToolCategory.dev]: {
    icon: "tool-category-dev",
    title: "开发者工具",
  },
  [ToolCategory.text]: {
    icon: "tool-category-text",
    title: "文本工具",
  },
  [ToolCategory.picture]: {
    icon: "tool-category-img",
    title: "图片工具",
  },
  [ToolCategory.encryption]: {
    icon: "tool-category-encryption",
    title: "加密工具",
  },
  [ToolCategory.admin]: {
    icon: "tool-category-admin",
    auth: ToolMetaAuth.admin,
    title: "后台工具",
  },
};
