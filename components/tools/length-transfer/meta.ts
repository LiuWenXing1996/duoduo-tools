import { lengthTransferMap } from "./utils";

const getAllMethods = () => {
  const baseKm = 1;
  return Object.values(lengthTransferMap)
    .map((e) => {
      const example = e.fromKm(baseKm);
      return `    ${e.label} : ${e.display(example)}`;
    })
    .join(";\n");
};

export default defineToolMeta({
  title: "长度转换器",
  description: `一个简单的长度转换器，支持的长度格式：
${getAllMethods()}; `,
  category: ToolCategory.unit,
});
