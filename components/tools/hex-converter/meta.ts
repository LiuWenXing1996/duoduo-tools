import { BaseRange } from "./utils";
export default defineToolMeta({
  title: "进制转换器",
  description: `支持 2-64 进制之间互转，进制待选数字：
    ${BaseRange.join(", ")};
`,
  category: ToolCategory.dev,
});
