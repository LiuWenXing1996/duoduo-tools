import { methods } from "./utils";

export default defineToolMeta({
  title: "字数统计",
  description: `支持统计以下信息: 
${methods
  .map((e) => {
    return `    ${e.name}`;
  })
  .join(";\n")};`,
  category: ToolCategory.text,
});
