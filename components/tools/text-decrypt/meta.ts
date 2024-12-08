import { EncryptType } from "./utils";

export default defineToolMeta({
  title: "文本解密",
  description: `使用各种算法解密文本, 支持的算法:
${Object.entries(EncryptType)
  .map(([e]) => {
    return `    ${e}`;
  })
  .join(";\n")};
`,
  category: ToolCategory.encryption,
  related: [
    ToolName["text-encrypt"],
    {
      title: "IT-TOOLS - 加密/解密文本",
      url: "https://www.aiotools.top/encryption",
    },
  ],
});
