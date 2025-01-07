export const temperatureTypes = [
  "Kelvin",
  "Celsius",
  "Fahrenheit",
  "Rankine",
  "Delisle",
  "Newton",
  "Reaumur",
  "Romer",
] as const;

export type TemperatureType = (typeof temperatureTypes)[number];

export type TemperatureTransfer = {
  label: string;
  toKelvin: (val: number) => number;
  formKelvin: (val: number) => number;
  display: (val: number) => string;
};

export const temperatureTransferMap: Record<
  TemperatureType,
  TemperatureTransfer
> = {
  Kelvin: {
    label: "开尔文 (Kelvin)",
    toKelvin: (val) => val,
    formKelvin: (val) => val,
    display: (val) => `${val} K`,
  },
  Celsius: {
    label: "摄氏度 (Celsius)",
    toKelvin: (val) => val + 273.15,
    formKelvin: (val) => val - 273.15,
    display: (val) => `${val} °C`,
  },
  Fahrenheit: {
    label: "华氏度 (Fahrenheit)",
    toKelvin: (val) => ((val - 32) * 5) / 9 + 273.15,
    formKelvin: (val) => ((val - 273.15) * 9) / 5 + 32,
    display: (val) => `${val} °F`,
  },
  Rankine: {
    label: "兰氏度 (Rankine)",
    toKelvin: (val) => (val * 5) / 9,
    formKelvin: (val) => (val * 9) / 5,
    display: (val) => `${val} °R`,
  },
  Delisle: {
    label: "德利尔 (Delisle)",
    toKelvin: (val) => 373.15 - (val * 2) / 3,
    formKelvin: (val) => ((373.15 - val) * 3) / 2,
    display: (val) => `${val} °D`,
  },
  Newton: {
    label: "牛顿 (Newton)",
    toKelvin: (val) => (val * 100) / 33 + 273.15,
    formKelvin: (val) => ((val - 273.15) * 33) / 100,
    display: (val) => `${val} °N`,
  },

  Reaumur: {
    label: "列式度 (Réaumur)",
    toKelvin: (val) => (val * 5) / 4 + 273.15,
    formKelvin: (val) => ((val - 273.15) * 4) / 5,
    display: (val) => `${val} °Ré`,
  },
  Romer: {
    label: "罗氏度 (Rømer)",
    toKelvin: (val) => ((val - 7.5) * 40) / 21 + 273.15,
    formKelvin: (val) => ((val - 273.15) * 21) / 40 + 7.5,
    display: (val) => `${val} °Rø`,
  },
};
