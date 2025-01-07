export const lengthTypes = [
  "km",
  "m",
  "dm",
  "cm",
  "mm",
  "dmm",
  "um",
  "nm",
  "tradition_li",
  "tradition_zhang",
  "tradition_chi",
  "tradition_cun",
  "tradition_fen",
  "tradition_mill",
  "tradition_hao",
  "eng_nmi",
  "eng_fm",
  "eng_mi",
  "eng_fur",
  "eng_yd",
  "eng_ft",
  "eng_in",
] as const;

export const lengthTypeGroup: {
  label: string;
  types: LengthType[];
}[] = [
  {
    label: "国际长度单位(公制)",
    types: ["km", "m", "dm", "cm", "mm", "dmm", "um", "nm"],
  },
  {
    label: "中国传统长度单位(市制)",
    types: [
      "tradition_li",
      "tradition_zhang",
      "tradition_chi",
      "tradition_cun",
      "tradition_fen",
      "tradition_mill",
      "tradition_hao",
    ],
  },
  {
    label: "英制长度单位",
    types: [
      "eng_nmi",
      "eng_fm",
      "eng_mi",
      "eng_fur",
      "eng_yd",
      "eng_ft",
      "eng_in",
    ],
  },
];

export type LengthType = (typeof lengthTypes)[number];

export type LengthTransfer = {
  label: string;
  toKm: (val: number) => number;
  fromKm: (val: number) => number;
  display: (val: number) => string;
};

export const lengthTransferMap: Record<LengthType, LengthTransfer> = {
  km: {
    label: "千米/公里(km)",
    toKm: (val) => val,
    fromKm: (val) => val,
    display: (val) => `${val} 千米`,
  },
  m: {
    label: "米(m)",
    toKm: (val) => val / 1000,
    fromKm: (val) => val * 1000,
    display: (val) => `${val} 米`,
  },
  dm: {
    label: "分米(dm)",
    toKm: (val) => val / 10000,
    fromKm: (val) => val * 10000,
    display: (val) => `${val} 分米`,
  },
  cm: {
    label: "厘米(cm)",
    toKm: (val) => val / 100000,
    fromKm: (val) => val * 100000,
    display: (val) => `${val} 厘米`,
  },
  mm: {
    label: "毫米(mm)",
    toKm: (val) => val / 1000000,
    fromKm: (val) => val * 1000000,
    display: (val) => `${val} 毫米`,
  },
  dmm: {
    label: "丝(dmm)",
    toKm: (val) => val / 10000000,
    fromKm: (val) => val * 10000000,
    display: (val) => `${val} 丝`,
  },
  um: {
    label: "微米(um)",
    toKm: (val) => val / 1000000000,
    fromKm: (val) => val * 1000000000,
    display: (val) => `${val} 微米`,
  },
  nm: {
    label: "纳米(nm)",
    toKm: (val) => val / 1000000000000,
    fromKm: (val) => val * 1000000000000,
    display: (val) => `${val} 纳米`,
  },
  tradition_li: {
    label: "里",
    toKm: (val) => val / 2,
    fromKm: (val) => val * 2,
    display: (val) => `${val} 里`,
  },
  tradition_zhang: {
    label: "丈",
    toKm: (val) => val / 300,
    fromKm: (val) => val * 300,
    display: (val) => `${val} 丈`,
  },
  tradition_chi: {
    label: "尺",
    toKm: (val) => val / 3000,
    fromKm: (val) => val * 3000,
    display: (val) => `${val} 尺`,
  },
  tradition_cun: {
    label: "寸",
    toKm: (val) => val / 30000,
    fromKm: (val) => val * 30000,
    display: (val) => `${val} 寸`,
  },
  tradition_fen: {
    label: "分",
    toKm: (val) => val / 300000,
    fromKm: (val) => val * 300000,
    display: (val) => `${val} 分`,
  },
  tradition_mill: {
    label: "厘",
    toKm: (val) => val / 3000000,
    fromKm: (val) => val * 3000000,
    display: (val) => `${val} 厘`,
  },
  tradition_hao: {
    label: "毫",
    toKm: (val) => val / 30000000,
    fromKm: (val) => val * 30000000,
    display: (val) => `${val} 毫`,
  },
  eng_nmi: {
    label: "海里(nmi)",
    toKm: (val) => val * 1.852,
    fromKm: (val) => val / 1.852,
    display: (val) => `${val} 海里`,
  },
  eng_fm: {
    label: "英寻(fm)",
    toKm: (val) => val * 0.0018288,
    fromKm: (val) => val / 0.0018288,
    display: (val) => `${val} 英寻`,
  },
  eng_mi: {
    label: "英里(mi)",
    toKm: (val) => val * 1.609344,
    fromKm: (val) => val / 1.609344,
    display: (val) => `${val} 英里`,
  },
  eng_fur: {
    label: "弗隆(fur)",
    toKm: (val) => val * 0.201168,
    fromKm: (val) => val / 0.201168,
    display: (val) => `${val} 弗隆`,
  },
  eng_yd: {
    label: "码(yd)",
    toKm: (val) => val * 0.0009144,
    fromKm: (val) => val / 0.0009144,
    display: (val) => `${val} 码`,
  },
  eng_ft: {
    label: "英尺(ft)",
    toKm: (val) => val * 0.0003048,
    fromKm: (val) => val / 0.0003048,
    display: (val) => `${val} 英尺`,
  },
  eng_in: {
    label: "英寸(in)",
    toKm: (val) => val * 0.0000254,
    fromKm: (val) => val / 0.0000254,
    display: (val) => `${val} 英寸`,
  },
};
