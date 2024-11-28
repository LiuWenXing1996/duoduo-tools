export const useAutoBoolean = (options?: { time?: number; init?: boolean }) => {
  const time = options?.time || 1000;
  const init = options?.init == undefined ? false : options?.init;
  const store = ref(init);
  let timer: ReturnType<typeof setTimeout> | undefined = undefined;
  const toggle = () => {
    if (timer) {
      clearTimeout(timer);
    }
    store.value = true;
    timer = setTimeout(() => {
      store.value = false;
    }, time);
  };

  const content = computed(() => store.value);

  return {
    content,
    toggle,
  };
};

