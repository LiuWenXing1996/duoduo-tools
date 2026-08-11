import type { DeepPartial } from "ts-essentials";
import { toString, toNumber, isNaN, isString } from "lodash-es";
import { dotCase } from "change-case";
import { get, set } from "radash";

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

export const constructByShortcut = <T extends object>(val: object): T => {
  let shortcutVals = {};
  const shortcut: any = val || {};
  const shortcutKeys = Object.keys(shortcut);
  for (const shortcutKey of shortcutKeys) {
    const key = dotCase(shortcutKey);
    const shortcutVal = shortcut[shortcutKey];
    shortcutVals = set(shortcutVals, key, shortcutVal);
  }
  const res = {
    ...shortcutVals,
  } as T;
  return res;
};

export type MappingObj<T, P extends string> = {
  [k in keyof T as `${P}${string & k}`]-?: T[k];
};

export type Primitive =
  | bigint
  | boolean
  | null
  | number
  | string
  | symbol
  | undefined;

export type PlainObject = Record<string, Primitive>;

export type UnionCommonKeys<T extends object> = keyof T;
export type UnionAllKeys<T> = T extends unknown ? keyof T : never;
export type SubtractKeys<A, C> = A extends C ? never : A;
export type UnionNonCommonKeys<T extends object> = SubtractKeys<
  UnionAllKeys<T>,
  UnionCommonKeys<T>
>;
export type UnionMerge<T extends object> = {
  [k in UnionCommonKeys<T>]: UnionPickTypeOf<T, k>;
} & {
  [k in UnionNonCommonKeys<T>]?: UnionPickTypeOf<T, k>;
};
export type UnionPickType<T, K extends UnionAllKeys<T>> = T extends {
  [k in K]?: any;
}
  ? T[K]
  : undefined;

export type UnionPickTypeOf<
  T,
  K extends string | number | symbol
> = K extends UnionAllKeys<T> ? UnionPickType<T, K> : never;
