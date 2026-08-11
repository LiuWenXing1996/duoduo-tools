export const weightTypes = [
  "t",
  "kg",
  "g",
  "mg",

  "jin",
  "liang",
  "qian",
  "dan",

  "eng_lb",
  "eng_oz",
  "eng_st",
  "eng_cwt",
  "eng_dr",
  "eng_gr",
  "eng_lt",

  "eng_lbt",
  "eng_ozt",
  "eng_grain",
  "eng_dwt",
] as const;

export const weightTypeGroup: {
  label: string;
  types: WeightType[];
}[] = [
  {
    label: "国际重量单位(公制)",
    types: ["t", "kg", "g", "mg"],
  },
  {
    label: "中国传统重量单位(市制)",
    types: ["jin", "liang", "qian", "dan"],
  },
  {
    label: "英制重量单位(常衡制)",
    types: [
      "eng_lb",
      "eng_oz",
      "eng_st",
      "eng_cwt",
      "eng_dr",
      "eng_gr",
      "eng_lt",
    ],
  },
  {
    label: "英制重量单位(金衡制)",
    types: ["eng_lbt", "eng_ozt", "eng_grain", "eng_dwt"],
  },
];

export type WeightType = (typeof weightTypes)[number];

export type WeightTransfer = {
  label: string;
  toT: (val: number) => number;
  fromT: (val: number) => number;
  display: (val: number) => string;
};

export const weightTransferMap: Record<WeightType, WeightTransfer> = {
  t: {
    label: "吨(t)",
    toT: (val) => val,
    fromT: (val) => val,
    display: (val) => `${val} 吨`,
  },
  kg: {
    label: "千克(kg)",
    toT: (val) => val / 1000,
    fromT: (val) => val * 1000,
    display: (val) => `${val} 千克`,
  },
  g: {
    label: "克(g)",
    toT: (val) => val / 1_000_000,
    fromT: (val) => val * 1_000_000,
    display: (val) => `${val} 克`,
  },
  mg: {
    label: "毫克(mg)",
    toT: (val) => val / 1_000_000_000,
    fromT: (val) => val * 1_000_000_000,
    display: (val) => `${val} 毫克`,
  },
  jin: {
    label: "斤(jin)",
    toT: (val) => val / 2000,
    fromT: (val) => val * 2000,
    display: (val) => `${val} 斤`,
  },
  liang: {
    label: "两(liang)",
    toT: (val) => val / 20000,
    fromT: (val) => val * 20000,
    display: (val) => `${val} 两`,
  },
  qian: {
    label: "钱(qian)",
    toT: (val) => val / 200000,
    fromT: (val) => val * 200000,
    display: (val) => `${val} 钱`,
  },
  dan: {
    label: "担(dan)",
    toT: (val) => val / 20,
    fromT: (val) => val * 20,
    display: (val) => `${val} 担`,
  },
  eng_lb: {
    label: "磅(lb)",
    toT: (val) => val / 2204.62,
    fromT: (val) => val * 2204.62,
    display: (val) => `${val} 磅`,
  },
  eng_oz: {
    label: "盎司(oz)",
    toT: (val) => val / 35273.96,
    fromT: (val) => val * 35273.96,
    display: (val) => `${val} 盎司`,
  },
  eng_st: {
    label: "英石(st)",
    toT: (val) => val / 157.47,
    fromT: (val) => val * 157.47,
    display: (val) => `${val} 英石`,
  },
  eng_cwt: {
    label: "英担(cwt)",
    toT: (val) => val / 19.684,
    fromT: (val) => val * 19.684,
    display: (val) => `${val} 英担`,
  },
  eng_dr: {
    label: "打兰(dr)",
    toT: (val) => val / 564383.39,
    fromT: (val) => val * 564383.39,
    display: (val) => `${val} 打兰`,
  },
  eng_gr: {
    label: "格令(gr)",
    toT: (val) => val / 15432358.35,
    fromT: (val) => val * 15432358.35,
    display: (val) => `${val} 格令`,
  },
  eng_lt: {
    label: "长吨(lt)",
    toT: (val) => val / 0.984143,
    fromT: (val) => val * 0.984143,
    display: (val) => `${val} 长吨`,
  },
  eng_lbt: {
    label: "磅(lbt)",
    toT: (val) => val / 2679.23,
    fromT: (val) => val * 2679.23,
    display: (val) => `${val} 磅`,
  },
  eng_ozt: {
    label: "盎司(ozt)",
    toT: (val) => val / 32150.75,
    fromT: (val) => val * 32150.75,
    display: (val) => `${val} 盎司`,
  },
  eng_grain: {
    label: "格令(grain)",
    toT: (val) => val / 15432358.35,
    fromT: (val) => val * 15432358.35,
    display: (val) => `${val} 格令`,
  },
  eng_dwt: {
    label: "英钱(dwt)",
    toT: (val) => val / 643014.93,
    fromT: (val) => val * 643014.93,
    display: (val) => `${val} 英钱`,
  },
};
