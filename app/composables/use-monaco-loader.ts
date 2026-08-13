import "monaco-editor/esm/nls.messages.zh-cn.js";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
let MonacoEnvironment = self.MonacoEnvironment || {};
// console.log(a);
MonacoEnvironment = {
  ...MonacoEnvironment,
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

export const useMonacoLoader = () => {
  const store = shallowRef<{
    lib: typeof monaco | undefined;
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
    { immediate: true },
  );
  const get = async () => {
    store.value = {
      ...store.value,
      loading: true,
    };
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
