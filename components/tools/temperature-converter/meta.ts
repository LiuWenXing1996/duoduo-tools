import { temperatureTransferMap } from "./utils";

const getAllMethods = () => {
  const baseK = 100;
  return Object.values(temperatureTransferMap)
    .map((e) => {
      const example = e.formKelvin(baseK);
      return `    ${e.label} : ${e.display(example)}`;
    })
    .join(";\n");
};

export default defineToolMeta({
  title: "温度转换器",
  description: `一个简单的温度转换器，支持的温度格式：
${getAllMethods()}; `,
  category: ToolCategory.unit,
});
