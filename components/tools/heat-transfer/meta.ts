import { heatTransferMap } from "./utils";

const getAllMethods = () => {
  const baseK = 1;
  return Object.values(heatTransferMap)
    .map((e) => {
      const example = e.fromWh(baseK);
      return `    ${e.label} : ${e.display(example)}`;
    })
    .join(";\n");
};

export default defineToolMeta({
  title: "热量转换器",
  description: `一个简单的热量转换器，支持的热量格式：
${getAllMethods()}; `,
  category: ToolCategory.unit,
});
