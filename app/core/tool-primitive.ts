import z from "zod";
import { defineTool } from "./tool";

export const ToolString = defineTool({
  name: "字符串",
  inputSchema: z.object({}),
  outputSchema: z.object({
    value: z.string(),
  }),
  run: () => {
    return { value: "字符串" };
  },
});

export const ToolConsole = defineTool({
  name: "打印",
  inputSchema: z.object({
    value: z.any(),
  }),
  outputSchema: z.object({}),
  run: (inputs) => {
    console.log(inputs);
    return {};
  },
});
