import type { DeepPartial } from "ts-essentials";
import { toString, toNumber, isNaN, isString } from "lodash-es";

// export const unSafeFunctionWrapper = <
//   T extends (...args: any) => any,
//   R extends ReturnType<T>,
//   P extends Parameters<T>
// >(
//   func: T
// ): ((...args: P) => DeepPartial<R> | undefined) => {
//   return func as (...args: P) => DeepPartial<R> | undefined;
// };

export const unSafeObjectDeepWrapper = <T extends object>(
  obj: T
): DeepPartial<T> => {
  return obj as DeepPartial<T>;
};

export const unSafeObjectWrapper = <T extends object>(obj: T): Partial<T> => {
  return obj as Partial<T>;
};

export const isPureNumberString = (val: any): val is string => {
  if (!isString(val)) {
    return false;
  }
  const num = toNumber(val);
  if (isNaN(num)) {
    return false;
  }
  const numStr = toString(num);
  const numStrNum = toNumber(numStr);
  if (num !== numStrNum) {
    return false;
  }
  return true;
};
