import nzh from "nzh";

export const chineseNumTypes = [
  "cnBig",
  "cnSmall",
  "hkBig",
  "hkSmall",
] as const;

export type ChineseNumType = (typeof chineseNumTypes)[number];

export type ChineseNumTransfer = {
  label: string;
  validate: (val: string) => boolean;
  toNum: (val: string) => string;
  fromNum: (val: string) => string;
};

export const chineseNumTransferMap: Record<ChineseNumType, ChineseNumTransfer> =
  {
    cnBig: {
      label: "简体中文大写",
      validate: (val) => {
        let res = false;
        try {
          const oldVal = val;
          const num = nzh.cn.decodeB(val);
          const newVal = nzh.cn.encodeB(num);
          res = oldVal === newVal;
        } catch (error) {
          res = false;
        }
        return res;
      },
      toNum: (val) => {
        return nzh.cn.decodeB(val);
      },
      fromNum: (val) => {
        return nzh.cn.encodeB(val);
      },
    },
    cnSmall: {
      label: "简体中文小写",
      validate: (val) => {
        let res = false;
        try {
          const oldVal = val;
          const num = nzh.cn.decodeS(val);
          const newVal = nzh.cn.encodeS(num);
          res = oldVal === newVal;
        } catch (error) {
          res = false;
        }
        return res;
      },
      toNum: (val) => {
        return nzh.cn.decodeS(val);
      },
      fromNum: (val) => {
        return nzh.cn.encodeS(val);
      },
    },
    hkBig: {
      label: "繁体中文大写",
      validate: (val) => {
        let res = false;
        try {
          const oldVal = val;
          const num = nzh.hk.decodeB(val);
          const newVal = nzh.hk.encodeB(num);
          res = oldVal === newVal;
        } catch (error) {
          res = false;
        }
        return res;
      },
      toNum: (val) => {
        return nzh.hk.decodeB(val);
      },
      fromNum: (val) => {
        return nzh.hk.encodeB(val);
      },
    },
    hkSmall: {
      label: "繁体中文小写",
      validate: (val) => {
        let res = false;
        try {
          const oldVal = val;
          const num = nzh.hk.decodeS(val);
          const newVal = nzh.hk.encodeS(num);
          res = oldVal === newVal;
        } catch (error) {
          res = false;
        }
        return res;
      },
      toNum: (val) => {
        return nzh.hk.decodeS(val);
      },
      fromNum: (val) => {
        return nzh.hk.encodeS(val);
      },
    },
  };
