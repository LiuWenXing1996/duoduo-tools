export const IntegerBaseRange =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");

export const convertIntegerBase = (params: {
  value: string;
  fromBase: number;
  toBase: number;
}) => {
  const { value, fromBase, toBase } = params;
  const range = IntegerBaseRange;
  const fromRange = range.slice(0, fromBase);
  const toRange = range.slice(0, toBase);
  let decValue = value
    .split("")
    .reverse()
    .reduce((carry: bigint, digit: string, index: number) => {
      if (!fromRange.includes(digit)) {
        throw new Error(`无效数字，${fromBase} 不包含此数字 ${digit}`);
      }
      return (carry +=
        BigInt(fromRange.indexOf(digit)) * BigInt(fromBase) ** BigInt(index));
    }, 0n);
  let newValue = "";
  while (decValue > 0) {
    newValue = toRange[Number(decValue % BigInt(toBase))] + newValue;
    decValue = (decValue - (decValue % BigInt(toBase))) / BigInt(toBase);
  }
  return newValue || "0";
};

export const isValidIntegerBase = (base: number) => {
  if (!base) {
    return false;
  }
  if (base < 2) {
    return false;
  }
  if (base > 64) {
    return false;
  }
  return true;
};

export const isValidNumberForIntegerBase = (val: string, base: number) => {
  const valNumberList = val.split("");
  const range = IntegerBaseRange.slice(0, base);
  const res = valNumberList.every((e) => range.includes(e));
  return res;
};
