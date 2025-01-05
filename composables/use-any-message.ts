import type { MessageOptions } from "naive-ui";

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

export const useAnyMessage = () => {
  const message = useMessage();
  return {
    ...message,
    anyError: (error: any, options?: MessageOptions) => {
      const msg = resolveErrorMessage(error);
      return message.error(msg, options);
    },
  };
};
