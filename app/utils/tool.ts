import type { RenderFunction, Component } from "vue";

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
  v2?: {
    input: Record<string, unknown>;
    operator: Component | RenderFunction;
    output: Record<string, unknown>;
    service: Function;
    preview: Component | RenderFunction;
  };
}

export const defineToolMeta = (meta: ToolMeta) => meta;
