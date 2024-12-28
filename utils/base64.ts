import { Base64 } from "js-base64";

export const textToBase64 = (str: string, urlSafe?: boolean) => {
  const encoded = Base64.encode(str, urlSafe);
  return encoded;
};
