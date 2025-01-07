import { timeTransferMap } from "./utils";

const getAllMethods = () => {
  const year = 1;
  const base = timeTransferMap.year.toSecond(year);
  return Object.values(timeTransferMap)
    .map((e) => {
      const example = e.formSecond(base);
      return `    ${e.label} : ${e.display(example)}`;
    })
    .join(";\n");
};

export default defineToolMeta({
  title: "时间转换器",
  description: `一个简单的时间转换器，支持的时间格式：
${getAllMethods()}; `,
  category: ToolCategory.unit,
});
