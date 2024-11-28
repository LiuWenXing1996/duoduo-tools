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
    icon: "iconoir:laptop-dev-mode",
    title: "开发者工具",
  },
  [ToolCategory.text]: {
    icon: "iconoir:text-square",
    title: "文本工具",
  },
  [ToolCategory.picture]: {
    icon: "material-symbols:imagesmode-outline-rounded",
    title: "图片工具",
  },
};
