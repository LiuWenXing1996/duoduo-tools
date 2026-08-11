import { methods } from "./utils";

const getAllMethods = () => {
  const colordInstance = methods["ColorName"].from("red");
  return Object.values(methods)
    .map((e) => {
      const example = e.to(colordInstance);
      return `    ${e.label} : ${example}`;
    })
    .join(";\n");
};

export default defineToolMeta({
  title: "颜色转换",
  description: `支持各种颜色格式之间互转，支持的颜色格式: 
${getAllMethods()};
`,
  category: ToolCategory.dev,
});
