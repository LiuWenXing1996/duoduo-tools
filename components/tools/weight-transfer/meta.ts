import { weightTransferMap } from "./utils";

const getAllMethods = () => {
  const base = 1;
  return Object.values(weightTransferMap)
    .map((e) => {
      const example = e.formT(base);
      return `    ${e.label} : ${e.display(example)}`;
    })
    .join(";\n");
};

export default defineToolMeta({
  title: "重量转换器",
  description: `一个简单的重量转换器，支持的重量格式：
${getAllMethods()}; `,
  category: ToolCategory.dev,
});
