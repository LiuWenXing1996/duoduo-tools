export const powerTypes = ["w", "mmw", "kw", "mw", "gw"] as const;

export type PowerType = (typeof powerTypes)[number];

export type PowerTransfer = {
  label: string;
  toW: (val: number) => number;
  fromW: (val: number) => number;
  display: (val: number) => string;
};

export const powerTransferMap: Record<PowerType, PowerTransfer> = {
  w: {
    label: "瓦(W)",
    toW: (val) => val,
    fromW: (val) => val,
    display: (val) => `${val} 瓦`,
  },
  mmw: {
    label: "毫瓦(mW)",
    toW: (val) => val / 1e3,
    fromW: (val) => val * 1e3,
    display: (val) => `${val} 毫瓦`,
  },
  kw: {
    label: "千瓦(kW)",
    toW: (val) => val * 1e3,
    fromW: (val) => val / 1e3,
    display: (val) => `${val} 千瓦`,
  },
  mw: {
    label: "兆瓦(MW)",
    toW: (val) => val * 1e6,
    fromW: (val) => val / 1e6,
    display: (val) => `${val} 兆瓦`,
  },
  gw: {
    label: "吉瓦(GW)",
    toW: (val) => val * 1e9,
    fromW: (val) => val / 1e9,
    display: (val) => `${val} 吉瓦`,
  },
};
