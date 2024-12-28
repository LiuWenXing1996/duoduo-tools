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
