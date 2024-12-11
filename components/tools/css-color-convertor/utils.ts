import { Colord, colord, extend, getFormat } from "colord";
import cmykPlugin from "colord/plugins/cmyk";
import hwbPlugin from "colord/plugins/hwb";
import namesPlugin from "colord/plugins/names";
import lchPlugin from "colord/plugins/lch";
extend([cmykPlugin, hwbPlugin, namesPlugin, lchPlugin]);

export enum ColorType {
  Hexadecimal = "Hexadecimal",
  RGB = "RGB",
  HSL = "HSL",
  HWB = "HWB",
  CMYK = "CMYK",
  LCH = "LCH",
  ColorName = "ColorName",
}

export const methods: Record<
  ColorType,
  {
    label: string;
    form: (val: string) => Colord;
    validate: (val: string) => boolean;
    to: (val: Colord) => string;
  }
> = {
  [ColorType.Hexadecimal]: {
    label: "Hexadecimal",
    form: (val) => {
      return colord(val);
    },
    validate: (val: string) => {
      if (!val) {
        return false;
      }
      try {
        return getFormat(val) === "hex";
      } catch (error) {
        return false;
      }
    },
    to: (val) => {
      return val.toHex();
    },
  },
  [ColorType.RGB]: {
    label: "RGB",
    form: (val) => {
      return colord(val);
    },
    validate: (val: string) => {
      if (!val) {
        return false;
      }
      try {
        return getFormat(val) === "rgb";
      } catch (error) {
        return false;
      }
    },
    to: (val) => {
      return val.toRgbString();
    },
  },
  [ColorType.HSL]: {
    label: "HSL",
    form: (val) => {
      return colord(val);
    },
    validate: (val: string) => {
      if (!val) {
        return false;
      }
      try {
        return getFormat(val) === "hsl";
      } catch (error) {
        return false;
      }
    },
    to: (val) => {
      return val.toHslString();
    },
  },
  [ColorType.ColorName]: {
    label: "ColorName",
    form: (val) => {
      return colord(val);
    },
    validate: (val: string) => {
      if (!val) {
        return false;
      }
      try {
        return getFormat(val) === "name";
      } catch (error) {
        return false;
      }
    },
    to: (val) => {
      return val.toName({ closest: true }) || "未知颜色";
    },
  },
  [ColorType.HWB]: {
    label: "HWB",
    form: (val) => {
      return colord(val);
    },
    validate: (val: string) => {
      if (!val) {
        return false;
      }
      try {
        return getFormat(val) === "hwb";
      } catch (error) {
        return false;
      }
    },
    to: (val) => {
      return val.toHwbString();
    },
  },
  [ColorType.CMYK]: {
    label: "CMYK",
    form: (val) => {
      return colord(val);
    },
    validate: (val: string) => {
      if (!val) {
        return false;
      }
      try {
        return getFormat(val) === "cmyk";
      } catch (error) {
        return false;
      }
    },
    to: (val) => {
      return val.toCmykString();
    },
  },
  [ColorType.LCH]: {
    label: "LCH",
    form: (val) => {
      return colord(val);
    },
    validate: (val: string) => {
      if (!val) {
        return false;
      }
      try {
        return getFormat(val) === "lch";
      } catch (error) {
        return false;
      }
    },
    to: (val) => {
      return val.toLchString();
    },
  },
};
