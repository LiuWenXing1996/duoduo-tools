import type { SelectOption } from "naive-ui";
import { pinyin } from "pinyin-pro";

export const arraify = <T>(target: T | T[]): T[] => {
  return Array.isArray(target) ? target : [target];
};

export const filterNullable = <T>(
  list: T[],
  isNullable?: (value: T) => boolean
): NonNullable<T>[] => {
  return list.filter((e) => {
    if (isNullable) {
      return isNullable(e);
    }
    return !!e;
  }) as NonNullable<T>[];
};

export const copyObject = <T extends Object>(obj: T) => {
  const ss = JSON.parse(JSON.stringify(obj));
  return ss as T;
};

export const jsonParseSafely = <T>(str?: string | null): T | undefined => {
  let res: T | undefined = undefined;
  try {
    res = JSON.parse(str || "");
  } catch (error) {}
  return res;
};
export * from "./tool-category";
export const defineSelectOptionList = <T extends object>(obj: {
  [key in keyof T]: SelectOption;
}): SelectOption[] => {
  return Object.entries(obj).map(([key, option]) => {
    return {
      key,
      value: key,
      ...(option as any),
    };
  });
};
export const sortByPinyin = <T>(
  list: T[],
  genKey: (val: T, all: T[]) => string
): T[] => {
  const isChinese = (val: string) => {
    return /[\u4e00-\u9fa5]/.test(val);
  };
  const nonChineseList: { key: string; pin: string; val: T }[] = [];
  const chineseList: { key: string; pin: string; val: T }[] = [];
  list.map((e) => {
    const key = genKey ? genKey(e, [...list]) : String(e);
    const isFirstChinese = isChinese(key[0]);
    const pin = pinyin(key, { separator: "" });
    if (isFirstChinese) {
      chineseList.push({ key, pin, val: e });
    } else {
      nonChineseList.push({ key, pin, val: e });
    }
  });
  const sortedList = [
    ...nonChineseList.toSorted((a, b) => {
      return a.pin > b.pin ? 1 : -1;
    }),
    ...chineseList.toSorted((a, b) => {
      return a.pin > b.pin ? 1 : -1;
    }),
  ].map((e) => e.val);
  return sortedList;
};
