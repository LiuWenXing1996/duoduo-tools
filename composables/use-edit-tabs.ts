import { useStorage } from "@vueuse/core";

const store = useStorage<{
  currentTabName: string | undefined;
  openedTabNames: string[];
}>("duoduo-tools-edit-tabs", {
  currentTabName: undefined,
  openedTabNames: [],
});
watch(
  () => store.value.currentTabName,
  () => {
    const router = useRouter();
    if (store.value.currentTabName) {
      nextTick(() => {
        router.push({
          path: `/tools/${store.value.currentTabName}`,
        });
      });
    } else {
      router.push(`/tools`);
    }
  }
);

export const useEditTabs = () => {
  const openedTabNames = computed(() => [...store.value.openedTabNames]);
  const currentTabName = computed(() => store.value.currentTabName);
  const addTab = (name: string) => {
    const oldOpenedTabNames = [...store.value.openedTabNames];
    const newOpenedTabNames = oldOpenedTabNames.includes(name)
      ? [...oldOpenedTabNames]
      : [...oldOpenedTabNames, name];
    store.value = {
      openedTabNames: newOpenedTabNames,
      currentTabName: name,
    };
  };
  const removeTab = (name: string) => {
    const oldOpenedTabNames = [...store.value.openedTabNames];
    const newOpenedTabNames = oldOpenedTabNames.filter((e) => e !== name);
    const newCurrentTabName =
      currentTabName.value === name
        ? newOpenedTabNames[0]
        : currentTabName.value;
    store.value = {
      openedTabNames: newOpenedTabNames,
      currentTabName: newCurrentTabName,
    };
  };
  const activeTab = (name: string) => {
    store.value = {
      ...store.value,
      currentTabName: name,
    };
  };
  const closeCurrentTab = () => {
    removeTab(currentTabName.value || "");
  };
  const closeOtherTabs = () => {
    const newOpenedTabNames = openedTabNames.value.filter(
      (e) => e === currentTabName.value
    );
    store.value = {
      ...store.value,
      openedTabNames: newOpenedTabNames,
    };
  };
  const closeAllTabs = () => {
    store.value = {
      openedTabNames: [],
      currentTabName: undefined,
    };
  };

  return {
    openedTabNames,
    currentTabName,
    addTab,
    removeTab,
    activeTab,
    closeCurrentTab,
    closeOtherTabs,
    closeAllTabs,
  };
};
