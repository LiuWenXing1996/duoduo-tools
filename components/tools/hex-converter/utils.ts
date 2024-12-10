export const isValidBase = (base: number) => {
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

export const BaseRange =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");

export const isValidNumberForBase = (val: string, base: number) => {
  const valNumberList = val.split("");
  const range = BaseRange.slice(0, base);
  const res = valNumberList.every((e) => range.includes(e));
  return res;
};
