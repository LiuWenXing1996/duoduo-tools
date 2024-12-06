import { list } from "#build/collect-tools/list";
import type { Component, VNodeChild } from "vue";

export interface Tool {
  name: string;
  content: () => Promise<{
    default: Component;
  }>;
  meta?: ToolMeta;
}

export const getAllTools = (): Tool[] => {
  return [...list];
};

export const findTool = (name: string) => {
  const tools = getAllTools();
  return tools.find((e) => e.name === name);
};
