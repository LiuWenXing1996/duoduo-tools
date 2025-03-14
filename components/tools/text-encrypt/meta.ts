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
  category: ToolCategory.encryption,
  related: [ToolName["text-decrypt"]],
});
