import loader, { type Monaco } from "@monaco-editor/loader";

export const useMonacoLoader = () => {
  loader.config({ "vs/nls": { availableLanguages: { "*": "zh-cn" } } });
  const store = shallowRef<{
    lib: Monaco | undefined;
    loading: boolean;
  }>({
    lib: undefined,
    loading: false,
  });
  const lib = computed(() => {
    return store.value?.lib;
  });
  const loading = computed(() => {
    return store.value?.loading;
  });
  const theme = useTheme();
  watch(
    [() => theme.isDark.value, () => store.value],
    ([isDark, storeValue]) => {
      if (storeValue?.lib) {
        storeValue.lib.editor.setTheme(isDark ? "vs-dark" : "vs");
        if (isDark) {
        }
      }
    },
    { immediate: true }
  );
  const get = async () => {
    store.value = {
      ...store.value,
      loading: true,
    };
    const monaco = await loader.init();
    store.value = {
      ...store.value,
      lib: monaco,
      loading: false,
    };
    return monaco;
  };
  return {
    get,
    lib,
    loading,
  };
};
