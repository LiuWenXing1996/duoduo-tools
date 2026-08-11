import { methods } from "./utils";

export default defineToolMeta({
  title: "Hmac 生成器",
  description: `使用各种 Hash 算法生成HMAC(密钥散列消息认证码), 支持的算法:
${methods
  .map((e) => {
    return `    ${e.name}`;
  })
  .join(";\n")};
`,
  category: ToolCategory.encryption,
});
