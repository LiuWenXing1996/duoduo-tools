export const useRouteHelper = () => {
  const route = useRoute();
  const reload = async () => {
    await navigateTo(route, {
      replace: true,
      external: true,
    });
  };
  return {
    reload,
  };
};
