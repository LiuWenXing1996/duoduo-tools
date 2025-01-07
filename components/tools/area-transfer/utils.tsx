import type { RenderFunction } from "vue";

export const areaTypes = [
  "km",
  "m",
  "dm",
  "cm",
  "mm",
  "ha",
  "tradition_mu",
  "tradition_fen",
  "tradition_mill",
  "tradition_hao",
  "eng_nmi",
  "eng_mi",
  "eng_acre",
  "eng_rd",
  "eng_yd",
  "eng_ft",
  "eng_in",
] as const;

export const areaTypeGroup: {
  label: string;
  types: AreaType[];
}[] = [
  {
    label: "国际面积单位(公制)",
    types: ["km", "m", "dm", "cm", "mm", "ha"],
  },
  {
    label: "中国传统面积单位(市制)",
    types: ["tradition_mu", "tradition_fen", "tradition_mill", "tradition_hao"],
  },
  {
    label: "英制面积单位",
    types: [
      "eng_nmi",
      "eng_mi",
      "eng_acre",
      "eng_rd",
      "eng_yd",
      "eng_ft",
      "eng_in",
    ],
  },
];

export type AreaType = (typeof areaTypes)[number];

export type AreaTransfer = {
  label: string | RenderFunction;
  toKm: (val: number) => number;
  formKm: (val: number) => number;
  display: (val: number) => string;
};

export const areaTransferMap: Record<AreaType, AreaTransfer> = {
  km: {
    label: () => {
      return (
        <span>
          平方千米(km<sup>2</sup>)
        </span>
      );
    },
    toKm: (val) => val,
    formKm: (val) => val,
    display: (val) => `${val} 平方千米`,
  },
  m: {
    label: () => {
      return (
        <span>
          平方米(m<sup>2</sup>)
        </span>
      );
    },
    toKm: (val) => val / 1e6,
    formKm: (val) => val * 1e6,
    display: (val) => `${val} 平方米`,
  },
  dm: {
    label: () => {
      return (
        <span>
          平方分米(dm<sup>2</sup>)
        </span>
      );
    },
    toKm: (val) => val / 1e8,
    formKm: (val) => val * 1e8,
    display: (val) => `${val} 平方分米`,
  },
  cm: {
    label: () => {
      return (
        <span>
          平方厘米(cm<sup>2</sup>)
        </span>
      );
    },
    toKm: (val) => val / 1e10,
    formKm: (val) => val * 1e10,
    display: (val) => `${val} 平方厘米`,
  },
  mm: {
    label: () => {
      return (
        <span>
          平方毫米(mm<sup>2</sup>)
        </span>
      );
    },
    toKm: (val) => val / 1e12,
    formKm: (val) => val * 1e12,
    display: (val) => `${val} 平方毫米`,
  },
  ha: {
    label: () => {
      return <span>公顷(ha)</span>;
    },
    toKm: (val) => val / 100,
    formKm: (val) => val * 100,
    display: (val) => `${val} 公顷`,
  },
  tradition_mu: {
    label: () => {
      return <span>亩</span>;
    },
    toKm: (val) => val / 1500,
    formKm: (val) => val * 1500,
    display: (val) => `${val} 亩`,
  },
  tradition_fen: {
    label: () => {
      return <span>分</span>;
    },
    toKm: (val) => val / 15000,
    formKm: (val) => val * 15000,
    display: (val) => `${val} 分`,
  },
  tradition_mill: {
    label: () => {
      return <span>厘</span>;
    },
    toKm: (val) => val / 150000,
    formKm: (val) => val * 150000,
    display: (val) => `${val} 厘`,
  },
  tradition_hao: {
    label: () => {
      return <span>毫</span>;
    },
    toKm: (val) => val / 1500000,
    formKm: (val) => val * 1500000,
    display: (val) => `${val} 毫`,
  },
  eng_nmi: {
    label: () => {
      return (
        <span>
          平方海里(nmi<sup>2</sup>)
        </span>
      );
    },
    toKm: (val) => val * 3.429904,
    formKm: (val) => val / 3.429904,
    display: (val) => `${val} 平方海里`,
  },
  eng_mi: {
    label: () => {
      return (
        <span>
          平方英里(mi<sup>2</sup>)
        </span>
      );
    },
    toKm: (val) => val * 2.589988,
    formKm: (val) => val / 2.589988,
    display: (val) => `${val} 平方英里`,
  },
  eng_acre: {
    label: () => {
      return <span>英亩(acre)</span>;
    },
    toKm: (val) => val * 0.00404686,
    formKm: (val) => val / 0.00404686,
    display: (val) => `${val} 英亩`,
  },
  eng_rd: {
    label: () => {
      return (
        <span>
          平方竿(rd<sup>2</sup>)
        </span>
      );
    },
    toKm: (val) => val * 0.0000252929,
    formKm: (val) => val / 0.0000252929,
    display: (val) => `${val} 平方竿`,
  },
  eng_yd: {
    label: () => {
      return (
        <span>
          平方码(yd<sup>2</sup>)
        </span>
      );
    },
    toKm: (val) => val * 0.000000836127,
    formKm: (val) => val / 0.000000836127,
    display: (val) => `${val} 平方码`,
  },
  eng_ft: {
    label: () => {
      return (
        <span>
          平方英尺(ft<sup>2</sup>)
        </span>
      );
    },
    toKm: (val) => val * 0.000000092903,
    formKm: (val) => val / 0.000000092903,
    display: (val) => `${val} 平方英尺`,
  },
  eng_in: {
    label: () => {
      return (
        <span>
          平方英寸(in<sup>2</sup>)
        </span>
      );
    },
    toKm: (val) => val * 0.00000000064516,
    formKm: (val) => val / 0.00000000064516,
    display: (val) => `${val} 平方英寸`,
  },
};
