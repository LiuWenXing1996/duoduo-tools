import { EncryptType } from "./utils";

export default defineToolMeta({
  title: "文本加密",
  description: `使用各种算法加密文本, 支持的算法:
${Object.entries(EncryptType)
  .map(([e]) => {
    return `    ${e}`;
  })
  .join(";\n")};
`,
  category: ToolCategory.text,
  related: [
    ToolName["text-decrypt"],
    {
      title: "IT-TOOLS - 加密/解密文本",
      url: "https://www.aiotools.top/encryption",
    },
  ],
});
