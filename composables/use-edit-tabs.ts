import { useStorage } from "@vueuse/core";

const store = useStorage<{
  currentTabName: string | undefined;
  openedTabNames: string[];
}>("web-tools-edit-tabs", {
  currentTabName: undefined,
  openedTabNames: [],
});

export const useEditTabs = () => {
  const router = useRouter();
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
    store.value = {
      openedTabNames: newOpenedTabNames,
      currentTabName: newOpenedTabNames[0],
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
  watch(
    () => store.value.currentTabName,
    () => {
      if (store.value.currentTabName) {
        router.push(`/tools/${store.value.currentTabName}`);
      } else {
        router.push(`/tools`);
      }
    }
  );
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
