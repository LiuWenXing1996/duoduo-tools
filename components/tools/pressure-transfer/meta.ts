import { pressureTransferMap } from "./utils";

const getAllMethods = () => {
  const baseK = 1;
  return Object.values(pressureTransferMap)
    .map((e) => {
      const example = e.formPa(baseK);
      return `    ${e.label} : ${e.display(example)}`;
    })
    .join(";\n");
};

export default defineToolMeta({
  title: "压力转换器",
  description: `一个简单的压力转换器，支持的压力格式：
${getAllMethods()}; `,
  category: ToolCategory.unit,
});
