import { type InternalApi } from "nitropack";

type User = InternalApi["/api/user/current"]["get"];
type UserSetting = InternalApi["/api/user/setting/detail"]["get"];
const store = shallowRef<{
  current?: User;
  setting?: UserSetting;
}>({});
const userRequest = useCustomRequest(async () => {
  let user: User | undefined = undefined;
  try {
    // @ts-ignore
    user = await $fetch("/api/user/current");
  } catch (error) {}
  store.value = {
    ...store.value,
    current: user,
  };
  return user;
});

const settingDetailRequest = useCustomRequest(async () => {
  if (store.value.current) {
    const res = await $fetch("/api/user/setting/detail", {
      params: {
        name: store.value.current?.name,
      },
    });
    store.value = {
      ...store.value,
      setting: res,
    };
    return res;
  }
});

export const useCurrentUser = () => {
  const current = computed(() => store.value.current);
  const setting = computed(() => store.value.setting);

  const refresh = async () => {
    await userRequest.refreshAsync();
    await settingDetailRequest.refreshAsync();
  };

  onMounted(() => {
    refresh();
  });
  return {
    current,
    setting,
    refresh,
    userRequest,
    settingDetailRequest,
  };
};
