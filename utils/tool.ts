import type { RenderFunction } from "vue";

export interface ToolMeta {
  title: string;
  description: string | RenderFunction;
  category: string;
  related?: (
    | {
        title: string;
        url: string;
      }
    | string
  )[];
}

export const defineToolMeta = (meta: ToolMeta) => meta;
