import { methods } from "./utils";

export default defineToolMeta({
  title: "Hash 文本",
  description: `使用各种 Hash 算法处理文本, 支持的算法:
${methods
  .map((e) => {
    return `    ${e.name}`;
  })
  .join(";\n")};
`,
  category: ToolCategory.text,
  related: [
    {
      title: "IT-TOOLS - Hash 文本",
      url: "https://www.aiotools.top/hash-text",
    },
  ],
});
