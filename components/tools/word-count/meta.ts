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
  related: [
    {
      title: "Tools-Web - 字数统计",
      url: "https://tools.ranblogs.com/wordcount",
    },
    {
      title: "IT-TOOLS - 文本统计",
      url: "https://www.aiotools.top/text-statistics",
    },
  ],
});
