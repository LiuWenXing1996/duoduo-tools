import { methods } from "./utils";

export default defineToolMeta({
  title: "更改单词格式",
  description: `更改单词格式, 支持各种单词格式:
${methods
  .map((e) => {
    return `    ${e.example}`;
  })
  .join(";\n")};
使用时，随意输入任意格式即可，程序会自动识别，也可以混用格式，例如 t-w-T_S`,
  category: ToolCategory.dev,
});
