import { darkTheme } from "naive-ui";

export const useTheme = () => {
  const colorMode = useColorMode();
  const isDark = computed(() => {
    return colorMode.value === "dark";
  });
  const current = computed(() => {
    if (isDark.value) {
      return darkTheme;
    }
    return null;
  });
  const setPreference = (val: string) => {
    colorMode.preference = val;
  };
  const preference = computed(() => {
    return colorMode.preference;
  });

  const toggle = () => {
    if (isDark.value) {
      colorMode.preference = "light";
    } else {
      colorMode.preference = "dark";
    }
  };
  return {
    toggle,
    setPreference,
    preference,
    current,
    isDark,
  };
};
