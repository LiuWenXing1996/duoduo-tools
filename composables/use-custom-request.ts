import { assign } from "radash";
import { useRequest } from "vue-request";

export const resolveErrorMessage = (error: any): string => {
  if (!error) {
    return "未知错误";
  }
  if (Array.isArray(error)) {
    return resolveErrorMessage(error[0]);
  }
  if (error.name === "FetchError") {
    return error.data?.message || error.message;
  }
  if (error.message) {
    return error.message;
  }
  const keys = Object.keys(error);
  return resolveErrorMessage(error[keys[0]]);
};

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
