export default defineToolMeta({
  title: "CSS 颜色预览",
  description: `预览输入的 CSS 色值, 支持各种合法色值: 
命名颜色: 例如 red, blue;
十六进制颜色: 例如 #ff0000, #f0f, #ff00ff80;
RGB 颜色: 例如 rgb(255, 0, 0);
RGBA 颜色: 例如 rgba(255, 0, 0, 0.5);
HSL 颜色: 例如 hsl(0, 100%, 50%);
HSLA 颜色: 例如 hsla(0, 100%, 50%, 0.5);
CSS 颜色函数 color(): 例如 color(display-p3 1 0 0);
`,
  category: ToolCategory.dev,
});
