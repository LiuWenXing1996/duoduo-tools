import { methods } from "./utils";

const getAllMethods = () => {
  const now = new Date();
  return Object.values(methods)
    .map((e) => {
      const example = e.to(now);
      return `    ${e.label} : ${example}`;
    })
    .join(";\n");
};

export default defineToolMeta({
  title: "日期转换器",
  description: `支持各种日期格式之间互转，支持的日期格式：
${getAllMethods()};
`,
  category: ToolCategory.dev,
});
