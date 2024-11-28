import { list } from "#build/collect-tools/list";
import type { VNodeChild } from "vue";
import type { ToolMeta } from "./define";

export interface Tool {
  name: string;
  content: () => VNodeChild;
  meta?: ToolMeta;
}

export const getAllTools = (): Tool[] => {
  return [...list];
};

export const findTool = (name: string) => {
  const tools = getAllTools();
  return tools.find((e) => e.name === name);
};
