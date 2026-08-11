import dayjs from "dayjs";
import {
  formatISO9075,
  formatRFC3339,
  formatRFC7231,
  parseISO,
} from "date-fns";

const DateTypeList = [
  "Unix-Timestamp",
  "Unix-Timestamp-Second",
  "ISO-8601",
  "ISO-9075",
  "RFC 3339",
  "RFC 7231",
  "UTC format",
  "Javascript-Date",
] as const;

export type DateType = (typeof DateTypeList)[number];

const ISO8601_REGEX =
  /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
const ISO9075_REGEX =
  /^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})(\.[0-9]{1,6})?(([+-])([0-9]{2}):([0-9]{2})|Z)?$/;

const RFC3339_REGEX =
  /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(\.[0-9]{1,9})?(([+-])([0-9]{2}):([0-9]{2})|Z)$/;

const RFC7231_REGEX =
  /^[A-Za-z]{3},\s[0-9]{2}\s[A-Za-z]{3}\s[0-9]{4}\s[0-9]{2}:[0-9]{2}:[0-9]{2}\sGMT$/;

export type DateTransfer = {
  label: string;
  to: (date: Date) => string;
  validate: (val: string) => boolean;
  from: (val: string) => Date;
};

export const dateTransferMap: Record<DateType, DateTransfer> = {
  ["ISO-8601"]: {
    label: "ISO 8601",
    to: (date: Date): string => {
      return date.toISOString();
    },
    validate: (val: string) => {
      if (!val) {
        return false;
      }
      return ISO8601_REGEX.test(val);
    },
    from: (val: string): Date => {
      return dayjs(val).toDate();
    },
  },
  ["ISO-9075"]: {
    label: "ISO 9075",
    to: (date: Date): string => {
      return formatISO9075(date);
    },
    validate: (val: string) => {
      if (!val) {
        return false;
      }
      return ISO9075_REGEX.test(val);
    },
    from: (val: string): Date => {
      return parseISO(val);
    },
  },
  ["Unix-Timestamp-Second"]: {
    label: "Unix 时间戳(秒)",
    to: (date: Date): string => {
      return dayjs(date).unix().toString();
    },
    validate: (val: string) => {
      if (!val) {
        return false;
      }
      return /^[0-9]{1,10}$/.test(val);
    },
    from: (val: string): Date => {
      return dayjs.unix(Number(val)).toDate();
    },
  },
  ["Unix-Timestamp"]: {
    label: "Unix 时间戳(毫秒)",
    to: (date: Date): string => {
      return date.valueOf().toString();
    },
    validate: (val: string) => {
      if (!val) {
        return false;
      }
      return /^[0-9]{1,13}$/.test(val);
    },
    from: (val: string): Date => {
      return dayjs(Number(val)).toDate();
    },
  },
  ["RFC 3339"]: {
    label: "RFC 3339",
    to: (date: Date): string => {
      return formatRFC3339(date);
    },
    validate: (val: string) => {
      if (!val) {
        return false;
      }
      return RFC3339_REGEX.test(val);
    },
    from: (date: string): Date => {
      return new Date(date);
    },
  },
  ["RFC 7231"]: {
    label: "RFC 7231",
    to: (date: Date): string => {
      return formatRFC7231(date);
    },
    validate: (val: string) => {
      if (!val) {
        return false;
      }
      return RFC7231_REGEX.test(val);
    },
    from: (date: string): Date => {
      return new Date(date);
    },
  },
  ["UTC format"]: {
    label: "UTC 格式",
    to: (date: Date): string => {
      return date.toUTCString();
    },
    validate: (val: string) => {
      if (!val) {
        return false;
      }
      try {
        return new Date(val).toUTCString() === val;
      } catch (error) {
        return false;
      }
    },
    from: (date: string): Date => {
      return new Date(date);
    },
  },
  ["Javascript-Date"]: {
    label: "Javascript Date toString",
    to: (date: Date): string => {
      return date.toString();
    },
    validate: (val: string) => {
      try {
        return new Date(val).toString() === val;
      } catch (error) {
        return false;
      }
    },
    from: (date: string): Date => {
      return new Date(date);
    },
  },
};

export const dateTransferDetect = (value: string) => {
  const all = Object.entries(dateTransferMap);
  const target = all.find(([, transfer]) => {
    return transfer.validate(value);
  });
  if (target) {
    return {
      type: target[0],
      transfer: target[1],
    };
  }
};
