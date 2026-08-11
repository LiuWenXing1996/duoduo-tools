import mime from "mime";

export const downloadURL = (url: string, name: string): void => {
  const link = document.createElement("a");
  link.download = name;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const base64ToDataURL = (base64: string, mimeType: string) => {
  return `data:${mimeType};base64,${base64}`;
};

export const base64ToDataURLByFileExtension = (
  base64: string,
  fileExtension: string
) => {
  const mimeType = mime.getType(fileExtension);
  if (!mimeType) {
    throw new Error(`unknown fileExtension: ${fileExtension}`);
  }
  return base64ToDataURL(base64, mimeType);
};

export const dataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[arr.length - 1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
