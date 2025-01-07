export const heatTypes = ["wh", "mmwh", "kwh", "mwh", "j", "kj"] as const;

export type HeatType = (typeof heatTypes)[number];

export type HeatTransfer = {
  label: string;
  toWh: (val: number) => number;
  fromWh: (val: number) => number;
  display: (val: number) => string;
};

export const heatTransferMap: Record<HeatType, HeatTransfer> = {
  wh: {
    label: "瓦时(Wh)",
    toWh: (val) => val,
    fromWh: (val) => val,
    display: (val) => `${val} 瓦时`,
  },
  mmwh: {
    label: "毫瓦时(mWh)",
    toWh: (val) => val / 1000,
    fromWh: (val) => val * 1000,
    display: (val) => `${val} 毫瓦时`,
  },
  kwh: {
    label: "千瓦时(kWh)",
    toWh: (val) => val * 1000,
    fromWh: (val) => val / 1000,
    display: (val) => `${val} 千瓦时`,
  },
  mwh: {
    label: "兆瓦时(MWh)",
    toWh: (val) => val * 1000000,
    fromWh: (val) => val / 1000000,
    display: (val) => `${val} 兆瓦时`,
  },
  j: {
    label: "焦耳(J)",
    toWh: (val) => val / 3600,
    fromWh: (val) => val * 3600,
    display: (val) => `${val} 焦耳`,
  },
  kj: {
    label: "千焦(kJ)",
    toWh: (val) => val / 3.6,
    fromWh: (val) => val * 3.6,
    display: (val) => `${val} 千焦`,
  },
};
