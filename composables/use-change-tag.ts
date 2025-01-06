import type { WatchOptions, WatchSource } from "vue";

export const useChangeTag = <S>(
  source: WatchSource<S> | WatchSource<S>[],
  options?: WatchOptions
) => {
  const changedTag = ref(false);
  watch(
    source,
    () => {
      changedTag.value = !changedTag.value;
    },
    options
  );
  const registerChange = () => {
    // 一个无意义的计算，用于触发 watch
    Boolean(changedTag.value);
  };

  return {
    registerChange,
  };
};
