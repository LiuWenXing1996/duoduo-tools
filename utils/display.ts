import dayjs from "dayjs";
import { isPlainObject, isArray, toString } from "lodash-es";
import {
  dateTransferDetect,
  dateTransferMap,
  DateType,
  type DateTransfer,
} from "./date";
import { unSafeObjectWrapper } from "./common";

export const displayHandlers = {
  text: (value: any): string => {
    if (!value) {
      return "";
    }
    let displayValue = "";
    try {
      if (isPlainObject(value) || isArray(value)) {
        displayValue = JSON.stringify(value);
      } else {
        displayValue = toString(value);
      }
    } catch (error) {
      displayValue = "";
    }
    return displayValue;
  },
  date: (
    value: any,
    options?: {
      inputType?: DateType;
      template?: string;
      invalidText?: string;
    }
  ) => {
    const template = options?.template || "YYYY-MM-DD HH:mm:ss";
    const invalidText = options?.invalidText || "无效的日期格式";
    if (!value) {
      return "";
    }
    let displayValue = "";
    try {
      let dateTransfer: DateTransfer | undefined = undefined;
      if (options?.inputType) {
        const dataType = options.inputType;
        dateTransfer = unSafeObjectWrapper(dateTransferMap)[dataType];
        if (!dateTransfer) {
          throw new Error(`无效的时间类型 ${dataType}`);
        }
        const isValid = dateTransfer.validate(value);
        if (!isValid) {
          throw new Error(`无效的时间值 ${value} , 预期类型 ${dataType}`);
        }
      } else {
        dateTransfer = dateTransferDetect(value)?.transfer;
        if (!dateTransfer) {
          throw new Error(`无法自动匹配到时间类型 ${value}`);
        }
      }
      const date = dateTransfer.form(value);
      displayValue = dayjs(date).format(template);
    } catch (error) {
      console.log(error);
      displayValue = `${invalidText}`;
    }
    return displayValue;
  },
} satisfies Record<string, (any: any) => string>;

export const displayTextValue = (value: any): string => {
  if (!value) {
    return "";
  }
  let displayValue = "";
  try {
    if (isPlainObject(value) || isArray(value)) {
      displayValue = JSON.stringify(value);
    } else {
      displayValue = toString(value);
    }
  } catch (error) {
    displayValue = "";
  }
  return displayValue;
};

export const displayDateValue = (
  value: any,
  options?: {
    inputType?: DateType;
    template?: string;
    invalidText?: string;
  }
) => {
  const template = options?.template || "YYYY-MM-DD HH:mm:ss";
  const invalidText = options?.invalidText || "无效的日期格式";
  if (!value) {
    return "";
  }
  let displayValue = "";
  try {
    let dateTransfer: DateTransfer | undefined = undefined;
    if (options?.inputType) {
      const dataType = options.inputType;
      dateTransfer = unSafeObjectWrapper(dateTransferMap)[dataType];
      if (!dateTransfer) {
        throw new Error(`无效的时间类型 ${dataType}`);
      }
      const isValid = dateTransfer.validate(value);
      if (!isValid) {
        throw new Error(`无效的时间值 ${value} , 预期类型 ${dataType}`);
      }
    } else {
      dateTransfer = dateTransferDetect(value)?.transfer;
      if (!dateTransfer) {
        throw new Error(`无法自动匹配到时间类型 ${value}`);
      }
    }
    const date = dateTransfer.form(value);
    displayValue = dayjs(date).format(template);
  } catch (error) {
    console.log(error);
    displayValue = `${invalidText}`;
  }
  return displayValue;
};

export type DisplayMapHandler<T, K extends keyof T> = (params: {
  key: K;
  value: T[K];
  object: T;
}) => {
  key: string;
  value: string;
};

export type DisplayMapOptions<T> = {
  [K in keyof T]-?: DisplayMapHandler<T, K>;
};

export class DisplayMap<T extends object> {
  map: Map<keyof T | string, DisplayMapHandler<T, keyof T>>;
  constructor(options: DisplayMapOptions<T>) {
    this.map = new Map(Object.entries(options));
  }
  display<K extends keyof T>(key: K, value: T[K], object: T) {
    const handler = this.map.get(key);
    if (handler) {
      return handler({ key, value, object });
    }
    return {
      key: displayTextValue(key),
      value: displayTextValue(value),
    };
  }
}
