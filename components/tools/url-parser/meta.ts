import { exampleUrl, methods } from "./utils";

const getAllMethods = () => {
  const url = new URL(exampleUrl);
  return Object.values(methods)
    .map((e) => {
      const example = e.to(url);
      return `    ${e.label} : ${example} `;
    })
    .join(";\n");
};

export default defineToolMeta({
  title: "URL字符串解析",
  description: `解析输入的 url 字符串，以 ${exampleUrl} 为例, 支持以下属性：
${getAllMethods()};
`,
  category: ToolCategory.dev,
});
