import { Base64 } from "js-base64";

export const textToBase64 = (str: string, urlSafe?: boolean) => {
  const encoded = Base64.encode(str, urlSafe);
  return encoded;
};


export const base64ToBlob = (base64String: string): string => {
  const binaryData = window.atob(base64String.split(',')[1]);
  const ia = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    ia[i] = binaryData.charCodeAt(i);
  }
  const blob = new Blob([ia], { type: 'image/png' });
  const url = URL.createObjectURL(blob);
  return url;
};
