import { assign } from "radash";
import { useRequest } from "vue-request";

export const useCustomRequest: typeof useRequest = (...rest) => {
  let [service, options, ...r] = rest;
  const message = useMessage();

  options = assign(
    {
      manual: true,
      onError: (error) => {
        console.log({ error });
        message.error(resolveErrorMessage(error));
      },
      loadingKeep: 300,
      debounceInterval: 300,
    },
    options || {}
  );
  return useRequest(service, options, ...r);
};
