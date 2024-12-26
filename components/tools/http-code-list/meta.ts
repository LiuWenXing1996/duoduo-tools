import { ToolsHttpCodeListDescription } from "#components";

export default defineToolMeta({
  title: "HTTP 状态码查看",
  description: () => h(ToolsHttpCodeListDescription),
  category: ToolCategory.dev,
});
