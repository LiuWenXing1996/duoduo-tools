import Operator from "./operator.vue";
import Preview from "./preview.vue";

export default defineToolMeta({
  title: "测试新版布局",
  description: `工具描述`,
  category: ToolCategory.dev,
  related: [
    "reg-test",
  ],
  v2: {
    input: {},
    operator: Operator,
    output: {},
    service: () => {},
    preview: Preview,
  },
});
