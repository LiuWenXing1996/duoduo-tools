export enum ToolCategory {
  dev = "dev",
  text = "text",
  picture = "picture",
  encryption = "encryption",
  network = "network",
  unit = "unit",
  life = "life",
}

export interface ToolCategoryMeta {
  icon: string;
  title: string;
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
  [ToolCategory.network]: {
    icon: "tool-category-network",
    title: "网络工具",
  },
  [ToolCategory.unit]: {
    icon: "tool-category-unit",
    title: "单位转换",
  },
  [ToolCategory.life]: {
    icon: "tool-category-life",
    title: "生活工具",
  },
};
