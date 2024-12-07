export default defineToolMeta({
  title: "中文简体繁体互转",
  description: `支持中文简体繁体之间相互转换，
- 繁体支持选择使用类型: 中国香港或中国台湾，
- 支持自定义字典，方便覆盖一些自动转换程序没有收录到的词
`,
  category: ToolCategory.text,
  related: [
    ToolName["chinese-to-mars"],
    {
      title: "帮小忙 - 简体繁体转换",
      url: "https://tool.browser.qq.com/chinese.html",
    },
  ],
});
