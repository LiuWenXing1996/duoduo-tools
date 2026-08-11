export default defineToolMeta({
  title: "CSS 颜色预览",
  description: `预览输入的 CSS 色值, 支持各种合法色值: 
        命名颜色: 例如 red, blue;
        十六进制: 例如 #ff0000, #f0f, #ff00ff80;
        RGB: 例如 rgb(255, 0, 0), rgb(255 0 153 / 80%);
        RGBA: 例如 rgba(255, 0, 0, 0.5);
        HSL: 例如 hsl(0, 100%, 50%), hsl(150 30% 60% / 0.8);
        HSLA: 例如 hsla(0, 100%, 50%, 0.5);
        HWB: 例如 hwb(12 50% 0%), hwb(194 0% 0% / 0.5);
        LAB: 例如 lab(50% 40 59.5), lab(50% 40 59.5 / 0.5);
        LCH: 例如 lch(52.2% 72.2 50), lch(52.2% 72.2 50 / 0.5);
        Oklab: 例如 oklab(59% 0.1 0.1), oklab(59% 0.1 0.1 / 0.5);
        Oklch: 例如 oklch(60% 0.15 50), oklch(60% 0.15 50 / 0.5);
        CSS 颜色函数 color(): 例如 color(display-p3 1 0 0);
`,
  category: ToolCategory.dev,
});
