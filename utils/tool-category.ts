export enum ToolCategory {
  dev = "dev",
  text = "text",
  picture = "picture",
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
};
