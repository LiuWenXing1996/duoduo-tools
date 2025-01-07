export const pressureTypes = [
  "pa",
  "hpa",
  "kpa",
  "mpa",
  "bar",
  "torr",
  "psi",
] as const;

export type PressureType = (typeof pressureTypes)[number];

export type PressureTransfer = {
  label: string;
  toPa: (val: number) => number;
  formPa: (val: number) => number;
  display: (val: number) => string;
};

export const pressureTransferMap: Record<PressureType, PressureTransfer> = {
  pa: {
    label: "帕(Pa)",
    toPa: (val) => val,
    formPa: (val) => val,
    display: (val) => `${val} 帕`,
  },
  hpa: {
    label: "百帕(hPa)",
    toPa: (val) => val * 100,
    formPa: (val) => val / 100,
    display: (val) => `${val} 百帕`,
  },
  kpa: {
    label: "千帕(kPa)",
    toPa: (val) => val * 1000,
    formPa: (val) => val / 1000,
    display: (val) => `${val} 千帕`,
  },
  mpa: {
    label: "兆帕(MPa)",
    toPa: (val) => val * 1e6,
    formPa: (val) => val / 1e6,
    display: (val) => `${val} 兆帕`,
  },
  bar: {
    label: "巴(bar)",
    toPa: (val) => val * 1e5,
    formPa: (val) => val / 1e5,
    display: (val) => `${val} 巴`,
  },
  torr: {
    label: "托(torr)",
    toPa: (val) => val * 133.322,
    formPa: (val) => val / 133.322,
    display: (val) => `${val} 托`,
  },
  psi: {
    label: "磅每平方英寸(psi)",
    toPa: (val) => val * 6894.76,
    formPa: (val) => val / 6894.76,
    display: (val) => `${val} 磅每平方英寸`,
  },
};
