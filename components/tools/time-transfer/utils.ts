export const timeTypes = [
  "year",
  "month",
  "d",
  "h",
  "min",
  "s",
  "ms",
  "week",
] as const;

export type TimeType = (typeof timeTypes)[number];

export type TimeTransfer = {
  label: string;
  toSecond: (val: number) => number;
  formSecond: (val: number) => number;
  display: (val: number) => string;
};

export const timeTransferMap: Record<TimeType, TimeTransfer> = {
  year: {
    label: "年",
    toSecond: (val) => val * 365 * 24 * 60 * 60,
    formSecond: (val) => val / (365 * 24 * 60 * 60),
    display: (val) => `${val} 年`,
  },
  month: {
    label: "月",
    toSecond: (val) => val * 30 * 24 * 60 * 60,
    formSecond: (val) => val / (30 * 24 * 60 * 60),
    display: (val) => `${val} 月`,
  },
  d: {
    label: "日",
    toSecond: (val) => val * 24 * 60 * 60,
    formSecond: (val) => val / (24 * 60 * 60),
    display: (val) => `${val} 日`,
  },
  h: {
    label: "时",
    toSecond: (val) => val * 60 * 60,
    formSecond: (val) => val / (60 * 60),
    display: (val) => `${val} 时`,
  },
  min: {
    label: "分",
    toSecond: (val) => val * 60,
    formSecond: (val) => val / 60,
    display: (val) => `${val} 分`,
  },
  s: {
    label: "秒",
    toSecond: (val) => val,
    formSecond: (val) => val,
    display: (val) => `${val} 秒`,
  },
  ms: {
    label: "毫秒",
    toSecond: (val) => val / 1000,
    formSecond: (val) => val * 1000,
    display: (val) => `${val} 毫秒`,
  },
  week: {
    label: "周",
    toSecond: (val) => val * 7 * 24 * 60 * 60,
    formSecond: (val) => val / (7 * 24 * 60 * 60),
    display: (val) => `${val} 周`,
  },
};
