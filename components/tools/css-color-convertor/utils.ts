import { Colord, colord, extend, getFormat } from "colord";
import cmykPlugin from "colord/plugins/cmyk";
import hwbPlugin from "colord/plugins/hwb";
import namesPlugin from "colord/plugins/names";
import lchPlugin from "colord/plugins/lch";
extend([cmykPlugin, hwbPlugin, namesPlugin, lchPlugin]);

const ColorTypeList = [
  "Hexadecimal",
  "RGB",
  "HSL",
  "HWB",
  "CMYK",
  "LCH",
  "ColorName",
] as const;

export type ColorType = (typeof ColorTypeList)[number];

export const methods: Record<
  ColorType,
  {
    label: string;
    from: (val: string) => Colord;
    validate: (val: string) => boolean;
    to: (val: Colord) => string;
  }
> = {
  Hexadecimal: {
    label: "Hexadecimal",
    from: (val) => {
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
  RGB: {
    label: "RGB",
    from: (val) => {
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
  HSL: {
    label: "HSL",
    from: (val) => {
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
  HWB: {
    label: "HWB",
    from: (val) => {
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
  CMYK: {
    label: "CMYK",
    from: (val) => {
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
  LCH: {
    label: "LCH",
    from: (val) => {
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
  ColorName: {
    label: "ColorName",
    from: (val) => {
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
};
