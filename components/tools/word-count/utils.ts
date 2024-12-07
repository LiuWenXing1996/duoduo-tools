export const methods: {
  name: string;
  run: (val: string) => string | number;
}[] = [
  { name: "总字数", run: (val) => val.length },
  { name: "汉字", run: (val) => (val.match(/[\u4e00-\u9fa5]/g) || []).length },
  { name: "数字", run: (val) => (val.match(/[\d+]/g) || []).length },
  { name: "行数", run: (val) => val.split(/\r\n|\r|\n/).length },
  { name: "字母", run: (val) => (val.match(/[a-zA-Z]/g) || []).length },
  { name: "空白字符", run: (val) => (val.match(/[\s*]/g) || []).length },
  {
    name: "大小",
    run: (val) => {
      const decimals = 2;
      const bytes = new TextEncoder().encode(val).buffer.byteLength;
      if (bytes === 0) {
        return "0 Bytes";
      }

      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${Number.parseFloat((bytes / k ** i).toFixed(decimals))} ${
        sizes[i]
      }`;
    },
  },
];
