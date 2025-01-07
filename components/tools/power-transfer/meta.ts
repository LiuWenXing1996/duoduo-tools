import { powerTransferMap } from "./utils";

const getAllMethods = () => {
  const baseK = 100;
  return Object.values(powerTransferMap)
    .map((e) => {
      const example = e.fromW(baseK);
      return `    ${e.label} : ${e.display(example)}`;
    })
    .join(";\n");
};

export default defineToolMeta({
  title: "功率转换器",
  description: `一个简单的powerTransferMap，支持的功率格式：
${getAllMethods()}; `,
  category: ToolCategory.unit,
});
